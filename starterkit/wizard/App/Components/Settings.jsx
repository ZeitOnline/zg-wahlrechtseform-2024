import {useCallback, useId, useState} from 'react';

import Input from 'core/components/Input';
import useStore, {
  starterkitConfigSelector,
  setStarterkitConfigSelector,
} from 'wizard/App/useStore';
import Button from 'core/components/Button';
import Headline from './Headline';
import cn from './Settings.module.scss';

function Settings() {
  const starterkitConfig = useStore(starterkitConfigSelector);
  const setStarterkitConfig = useStore(setStarterkitConfigSelector);

  const id = useId();
  const [value, setValue] = useState(
    starterkitConfig.deploymentPath === '2023/starterkit'
      ? ''
      : starterkitConfig.deploymentPath,
  );

  const handleInput = useCallback((event) => {
    setValue(event.target.value);
  }, []);
  const handleSave = useCallback(
    (event) => {
      event.preventDefault();
      setStarterkitConfig({deploymentPath: value});
    },
    [setStarterkitConfig, value],
  );

  return (
    <form onSubmit={handleSave} className={cn.container}>
      <Headline>Einstellungen</Headline>
      <div className={cn.deploymentPath}>
        <div className={cn.input}>
          <label htmlFor={id}>Deployment-Pfad</label>
          <Input
            id={id}
            placeholder="2022/starterkit"
            value={value}
            onInput={handleInput}
            size="20"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
        <Button look="inky" type="submit">
          Speichern
        </Button>
      </div>
    </form>
  );
}

export default Settings;
