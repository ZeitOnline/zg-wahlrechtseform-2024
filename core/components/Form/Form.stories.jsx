import {Default as Select} from 'core/components/Select/Select.stories.jsx';
import {Default as Autocomplete} from 'core/components/Autocomplete/Autocomplete.stories.jsx';
import {All as Button} from 'core/components/Button/Button.stories.jsx';
import {Default as Input} from 'core/components/Input/Input.stories.jsx';
import {Default as MultipleSelectionAutocomplete} from 'core/components/MultipleSelectionAutocomplete/MultipleSelectionAutocomplete.stories.jsx';
import {Default as Switcher} from 'core/components/Switcher/Switcher.stories.jsx';
import {Default as Range} from 'core/components/Range/Range.stories.jsx';
import {Default as Toggle} from 'core/components/Toggle/Toggle.stories.jsx';
import {Default as Checkbox} from 'core/components/Checkbox/Checkbox.stories.jsx';
import {Default as Stepper} from 'core/components/Stepper/Stepper.stories.jsx';

import cn from './Form.stories.module.scss';

export default {
  title: 'Components/Übersicht',
};

export const Default = () => {
  return (
    <>
      <div className={cn.row}>
        <label className={cn.label}>{'<Select />'}</label>
        <div className={cn.formElement}>
          <Select />
        </div>
      </div>
      <div className={cn.row}>
        <label className={cn.label}>{'<Autocomplete />'}</label>
        <div className={cn.formElement}>
          <Autocomplete />
        </div>
      </div>
      <div className={cn.row}>
        <label className={cn.label}>{'<Button />'}</label>
        <div className={cn.formElement}>
          <Button />
        </div>
      </div>
      <div className={cn.row}>
        <label className={cn.label}>{'<Input />'}</label>
        <div className={cn.formElement}>
          <Input />
        </div>
      </div>
      <div className={cn.row}>
        <label className={cn.label}>
          {'<MultipleSelectionAutocomplete />'}
        </label>
        <div className={cn.formElement}>
          <MultipleSelectionAutocomplete />
        </div>
      </div>
      <div className={cn.row}>
        <label className={cn.label}>{'<Switcher />'}</label>
        <div className={cn.formElement}>
          <Switcher />
        </div>
      </div>
      <div className={cn.row}>
        <label className={cn.label}>{'<Range />'}</label>
        <div className={cn.formElement}>
          <Range />
        </div>
      </div>
      <div className={cn.row}>
        <label className={cn.label}>{'<Toggle />'}</label>
        <div className={cn.formElement}>
          <Toggle />
        </div>
      </div>
      <div className={cn.row}>
        <label className={cn.label}>{'<Checkbox />'}</label>
        <div className={cn.formElement}>
          <Checkbox />
        </div>
      </div>
      <div className={cn.row}>
        <label className={cn.label}>{'<Stepper />'}</label>
        <div className={cn.formElement}>
          <Stepper />
        </div>
      </div>
    </>
  );
};
