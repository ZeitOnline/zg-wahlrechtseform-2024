import React, {useCallback, useEffect} from 'react';
import {addons, types, useGlobals} from '@storybook/manager-api';
import {create} from '@storybook/theming/create';
import {IconButton} from '@storybook/components';
import {SunIcon, MoonIcon} from '@storybook/icons';

const theme = create({
  brandTitle: 'Zeit Online Storybook',
  brandUrl: 'https://zeit.de/datenjournalismus',
  brandImage:
    'https://storage.googleapis.com/assets-interactive/g/storybook/zon.png',
  brandTarget: '_blank',
  fontBase: 'TabletGothic, sans-serif',
});

addons.setConfig({
  theme,
});

addons.register('dark-mode', () => {
  addons.add('dark-mode/toolbar', {
    title: 'Toggle Dark Mode',
    type: types.TOOL,
    match: ({tabId, viewMode}) => !tabId && viewMode === 'story',
    render: () => {
      const [globals, updateGlobals] = useGlobals();
      const isActive = [true, 'true'].includes(globals['darkMode']);

      const toggleMyTool = useCallback(() => {
        updateGlobals({
          darkMode: !isActive,
        });
      }, [isActive]);

      useEffect(() => {
        try {
          const intialDarkMode = window.matchMedia(
            '(prefers-color-scheme: dark)',
          ).matches;
          updateGlobals({darkMode: intialDarkMode});
        } catch (e) {}
      }, []);

      return (
        <IconButton title="Toggle Dark Mode" onClick={toggleMyTool}>
          {isActive ? <SunIcon /> : <MoonIcon />}
        </IconButton>
      );
    },
  });
});
