import {create} from 'zustand';
import {merge, cloneDeep} from 'lodash-es';

let _use = () => {};
let storeCreated = false;

export async function loadApps() {
  const request = await fetch('/api/wizard/apps');
  const apps = await request.json();
  return apps.data;
}
export async function loadAppTemplates() {
  const request = await fetch('/api/wizard/app-templates');
  const appTemplates = await request.json();
  return appTemplates.data;
}

async function loadStoreData(set) {
  const apps = await loadApps();
  set({apps});
  const appTemplates = await loadAppTemplates();
  set({appTemplates});
}

export function useCreateStoreWithHydrationData(hydrationData) {
  if (!storeCreated) {
    _use = create((set) => {
      const initialState = {
        apps: [],
        appTemplates: [],
        ...hydrationData,
        setStarterkitConfig: (confChanges) => {
          set((state) => {
            async function save() {
              const request = await fetch('/api/wizard/starterkit-config', {
                method: 'PATCH',
                body: JSON.stringify(confChanges),
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              const newConfig = await request.json();
              set({starterkitConfig: newConfig});
            }
            save();
            const newStarterkitConfig = merge(
              cloneDeep(state.starterkitConfig),
              confChanges,
            );
            return {
              starterkitConfig: newStarterkitConfig,
            };
          });
        },
        addApp: ({name, template, inputValues}) => {
          async function save() {
            const request = await fetch('/api/wizard/apps', {
              method: 'POST',
              body: JSON.stringify({name, template, inputValues}),
              headers: {
                'Content-Type': 'application/json',
              },
            });

            const apps = await request.json();
            set({apps: apps.data});
            return true;
          }
          if (name && template) {
            return save();
          }
          return false;
        },
      };
      if (typeof window !== 'undefined') {
        loadStoreData(set);
      }

      return initialState;
    });

    // for SSR, we need to create a new store every time,
    // because we are potentially rendering hundreds of
    // different pages with different data
    storeCreated = typeof window === 'undefined' ? false : true;
  }
}

export const starterkitConfigSelector = (state) => state.starterkitConfig;
export const setStarterkitConfigSelector = (state) => state.setStarterkitConfig;
export const appTemplatesSelector = (state) => state.appTemplates;
export const appsSelector = (state) => state.apps;
export const addAppSelector = (state) => state.addApp;

export default function useStore(selector) {
  return _use(selector);
}
