import {useCallback, useEffect, useId, useMemo, useRef, useState} from 'react';

import Button from 'core/components/Button';
import Headline from './Headline';
import cn from './Apps.module.scss';
import useStore, {
  appsSelector,
  addAppSelector,
  appTemplatesSelector,
} from 'wizard/App/useStore';
import useToggle from 'core/hooks/useToggle';
import Input from 'core/components/Input';
import Loader from 'core/components/Loader';

function NewAppDialog() {
  const id = useId();
  const [open, toggleOpen] = useToggle();
  const [loading, setLoading] = useState();

  const apps = useStore(appsSelector);
  const hasIndexApp = apps.includes('index');
  const inputRef = useRef();

  const [name, setName] = useState(hasIndexApp ? '' : 'index');
  const [template, setTemplate] = useState(null);

  const addApp = useStore(addAppSelector);
  const appTemplates = useStore(appTemplatesSelector);

  const inputs = useMemo(() => {
    return appTemplates.find((d) => d.id === template)?.config?.inputs || [];
  }, [appTemplates, template]);

  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    if (!template && appTemplates.length) {
      setTemplate(appTemplates[0].id);
    }
  }, [appTemplates, template]);

  const handleInputChange = useCallback(
    (name, event) => {
      const newValues = {...inputValues};
      newValues[name] = event.target.value;
      setInputValues(newValues);
    },
    [inputValues],
  );

  const handleAddNewApp = useCallback(
    async (event) => {
      event.preventDefault();
      if (name && template) {
        setLoading(true);
        const done = await addApp({name, template, inputValues});
        setLoading(false);

        if (done) {
          toggleOpen(false);
        }
      }
    },
    [name, template, addApp, inputValues, toggleOpen],
  );

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef?.current?.focus();
      inputRef?.current?.select();
    }
  }, [open, inputRef]);

  if (!open) {
    return (
      <Button look="inky" onClick={() => toggleOpen(true)}>
        Neue App
      </Button>
    );
  }

  return (
    <>
      {loading && (
        <div className={cn.loadingOverlay}>
          <Loader isLoading={true} />
          <div className={cn.loadingNote}>
            Das Erstellen der App kann bis zu einer Minute dauern...
          </div>
        </div>
      )}
      <form onSubmit={handleAddNewApp} className={cn.newAppDialog}>
        <ul>
          <li>
            <label htmlFor={`name${id}`}>
              App-Name <small>(camelCase)</small>:
            </label>
            <Input
              id={`name${id}`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={hasIndexApp ? 'nameDerApp' : 'index'}
              innerRef={inputRef}
            />
          </li>
          <li>
            <label htmlFor={`template${id}`}>Vorlage:</label>
            <select
              value={template}
              onChange={(event) => setTemplate(event.target.value)}
            >
              {appTemplates.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </li>
          {inputs.map(({label, description, ...d}) => (
            <div className={cn.inputWrapper} key={d.name}>
              {label && (
                <label className={cn.inputLabel} htmlFor={`search-${d.name}`}>
                  {label}
                  {description && <small> {description}</small>}
                </label>
              )}
              {/* must be have search at start or end to prevent 1pw to show up */}
              <Input
                {...d}
                id={`search-${d.name}`}
                autoComplete="off"
                placeholder="projektname"
                value={inputValues[d.name]}
                onChange={(event) => handleInputChange(d.name, event)}
              />
            </div>
          ))}
          <li>
            <Button look="inky" type="submit">
              App erstellen
            </Button>
            <Button onClick={() => toggleOpen(false)}>Abbrechen</Button>
          </li>
        </ul>
      </form>
    </>
  );
}

function Apps() {
  const apps = useStore(appsSelector);

  return (
    <div className={cn.container}>
      <Headline>Apps</Headline>
      <ul className={cn.list}>
        {apps.map((appName) => {
          return (
            <li className={cn.app} key={appName}>
              <h5>{appName}</h5>
              <Button size="small" tagName="a" href={`/${appName}`}>
                Anzeigen
              </Button>
              {/* <Button size="small">Deploy</Button> */}
            </li>
          );
        })}
        <li>
          <NewAppDialog />
        </li>
      </ul>
    </div>
  );
}

export default Apps;
