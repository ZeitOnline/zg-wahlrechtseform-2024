import React from 'react';
import {global} from '@storybook/global';
import {useEffect, useGlobals} from '@storybook/preview-api';
import 'core/styles/css-variables.scss';
import './styles.module.scss';

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  options: {
    storySort: (a, b) =>
      a.title === b.title
        ? 0
        : a.id.localeCompare(b.id, undefined, {numeric: true}),
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const globalTypes = {
  darkMode: {type: 'boolean'},
};

export const withDarkMode = (StoryFn) => {
  const [globals] = useGlobals();
  const darkMode = [true, 'true'].includes(globals['darkMode']);

  useEffect(() => {
    if (darkMode) {
      global.document.documentElement.classList.add('color-scheme-dark');
      global.document.documentElement.classList.remove('color-scheme-light');
    } else {
      global.document.documentElement.classList.remove('color-scheme-dark');
      global.document.documentElement.classList.add('color-scheme-light');
    }
  }, [darkMode]);

  return StoryFn();
};

export const decorators = [
  withDarkMode,
  (StoryFn) => (
    <div className="page__content">
      <main className="main main--article">
        <div className="article-body article-body--article">
          <div className="article-page">{StoryFn()}</div>
        </div>
      </main>
    </div>
  ),
];
