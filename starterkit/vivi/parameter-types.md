<a name="module_parameterTypes"></a>

## parameterTypes

* [parameterTypes](#module_parameterTypes)
    * [~viviParameterTypes](#module_parameterTypes..viviParameterTypes)
        * [.string(obj)](#module_parameterTypes..viviParameterTypes.string) ⇒ <code>String</code>
        * [.text(obj)](#module_parameterTypes..viviParameterTypes.text) ⇒ <code>String</code>
        * [.oneOf(obj)](#module_parameterTypes..viviParameterTypes.oneOf) ⇒ <code>String</code>
        * [.boolean(obj)](#module_parameterTypes..viviParameterTypes.boolean) ⇒ <code>boolean</code>
        * [.integer(obj)](#module_parameterTypes..viviParameterTypes.integer) ⇒ <code>integer</code>
        * [.float(obj)](#module_parameterTypes..viviParameterTypes.float) ⇒ <code>float</code>
        * [.datetime(obj)](#module_parameterTypes..viviParameterTypes.datetime) ⇒ <code>string</code>
        * [.isTruncatedByPaywall(obj)](#module_parameterTypes..viviParameterTypes.isTruncatedByPaywall) ⇒ <code>boolean</code>
        * [.isRebrushed(obj)](#module_parameterTypes..viviParameterTypes.isRebrushed) ⇒ <code>boolean</code>
        * [.pagetype(obj)](#module_parameterTypes..viviParameterTypes.pagetype) ⇒ <code>String</code>
        * [.isUniqueId(obj)](#module_parameterTypes..viviParameterTypes.isUniqueId) ⇒ <code>String</code>
        * [.parameterCount(obj)](#module_parameterTypes..viviParameterTypes.parameterCount) ⇒ <code>Number</code>
        * [.static(obj)](#module_parameterTypes..viviParameterTypes.static) ⇒ <code>String(value)</code>
        * [.imageGroup(obj)](#module_parameterTypes..viviParameterTypes.imageGroup) ⇒ <code>object</code>

<a name="module_parameterTypes..viviParameterTypes"></a>

### parameterTypes~viviParameterTypes
viviParameterTypes

**Kind**: inner constant of [<code>parameterTypes</code>](#module_parameterTypes)  

* [~viviParameterTypes](#module_parameterTypes..viviParameterTypes)
    * [.string(obj)](#module_parameterTypes..viviParameterTypes.string) ⇒ <code>String</code>
    * [.text(obj)](#module_parameterTypes..viviParameterTypes.text) ⇒ <code>String</code>
    * [.oneOf(obj)](#module_parameterTypes..viviParameterTypes.oneOf) ⇒ <code>String</code>
    * [.boolean(obj)](#module_parameterTypes..viviParameterTypes.boolean) ⇒ <code>boolean</code>
    * [.integer(obj)](#module_parameterTypes..viviParameterTypes.integer) ⇒ <code>integer</code>
    * [.float(obj)](#module_parameterTypes..viviParameterTypes.float) ⇒ <code>float</code>
    * [.datetime(obj)](#module_parameterTypes..viviParameterTypes.datetime) ⇒ <code>string</code>
    * [.isTruncatedByPaywall(obj)](#module_parameterTypes..viviParameterTypes.isTruncatedByPaywall) ⇒ <code>boolean</code>
    * [.isRebrushed(obj)](#module_parameterTypes..viviParameterTypes.isRebrushed) ⇒ <code>boolean</code>
    * [.pagetype(obj)](#module_parameterTypes..viviParameterTypes.pagetype) ⇒ <code>String</code>
    * [.isUniqueId(obj)](#module_parameterTypes..viviParameterTypes.isUniqueId) ⇒ <code>String</code>
    * [.parameterCount(obj)](#module_parameterTypes..viviParameterTypes.parameterCount) ⇒ <code>Number</code>
    * [.static(obj)](#module_parameterTypes..viviParameterTypes.static) ⇒ <code>String(value)</code>
    * [.imageGroup(obj)](#module_parameterTypes..viviParameterTypes.imageGroup) ⇒ <code>object</code>

<a name="module_parameterTypes..viviParameterTypes.string"></a>

#### viviParameterTypes.string(obj) ⇒ <code>String</code>
A string without linebreaks

**Kind**: static method of [<code>viviParameterTypes</code>](#module_parameterTypes..viviParameterTypes)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| obj.name | <code>string</code> | name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit) |
| obj.description | <code>string</code> | extended description for Vivi interface, appears on hover |
| obj.label | <code>string</code> | Label displayed in vivi. |
| obj.maxLength | <code>integer</code> \| <code>null</code> | max length for text |
| obj.required | <code>boolean</code> |  |
| obj.escape | <code>boolean</code> | html escape string in vivi * string({    name: 'headline',    label: 'Überschrift',    maxLength: 64, }) |

<a name="module_parameterTypes..viviParameterTypes.text"></a>

#### viviParameterTypes.text(obj) ⇒ <code>String</code>
A multiline string. Warning: removes all linebreaks, so mainly for editing comfort

**Kind**: static method of [<code>viviParameterTypes</code>](#module_parameterTypes..viviParameterTypes)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| obj.name | <code>string</code> | name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit) |
| obj.description | <code>string</code> | extended description for Vivi interface, appears on hover |
| obj.label | <code>string</code> | Label displayed in vivi. |
| obj.required | <code>boolean</code> |  |
| obj.escape | <code>boolean</code> | html escape string in vivi text({    name: 'paragraph',    label: 'Absatz', }) |

<a name="module_parameterTypes..viviParameterTypes.oneOf"></a>

#### viviParameterTypes.oneOf(obj) ⇒ <code>String</code>
Array of strings, renders a dropdown in Vivi

**Kind**: static method of [<code>viviParameterTypes</code>](#module_parameterTypes..viviParameterTypes)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| obj.name | <code>string</code> | name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit) |
| obj.description | <code>string</code> | extended description for Vivi interface, appears on hover |
| obj.options | <code>Array.&lt;Object&gt;</code> | Available options for this parameter. |
| obj.options[].label | <code>string</code> | The label for this option displayed in vivi. |
| obj.options[].propValue | <code>string</code> | The value passed as a prop to the app if this options is selected. |
| obj.required | <code>boolean</code> |  |

**Example**  
```js
oneOf({
 name: 'display',
 label: 'Zeige',
 options: [
   {label: 'Liniendiagramm Mutationen', propValue: 'mutation-line-chart'}
   {label: 'Liniendiagramm Tests', propValue: 'test-line-chart'}
 ]
})
```
<a name="module_parameterTypes..viviParameterTypes.boolean"></a>

#### viviParameterTypes.boolean(obj) ⇒ <code>boolean</code>
Boolean, renders a checkbox in Vivi

**Kind**: static method of [<code>viviParameterTypes</code>](#module_parameterTypes..viviParameterTypes)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| obj.name | <code>string</code> | name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit) |
| obj.description | <code>string</code> | extended description for Vivi interface, appears on hover |
| obj.label | <code>string</code> | Label displayed in vivi. |
| obj.required | <code>boolean</code> | Whether this parameter is required or not. |
| obj.defaultValue | <code>boolean</code> | Default value for this parameter. |

**Example**  
```js
boolean({
 name: 'collapsed',
 label: 'Eingeklappt',
 defaultValue: false
})
```
<a name="module_parameterTypes..viviParameterTypes.integer"></a>

#### viviParameterTypes.integer(obj) ⇒ <code>integer</code>
Integer number
min/max are very buggy and break Vivi sometimes, so we don’t use them

**Kind**: static method of [<code>viviParameterTypes</code>](#module_parameterTypes..viviParameterTypes)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| obj.name | <code>string</code> | name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit) |
| obj.description | <code>string</code> | extended description for Vivi interface, appears on hover |
| obj.label | <code>string</code> | Label displayed in vivi. |
| obj.defaultValue | <code>integer</code> | default value |
| obj.required | <code>boolean</code> |  |

**Example**  
```js
integer({
   name: 'myNumber',
   label: 'Meine Nummer',
   defaultValue: 10,
})
```
<a name="module_parameterTypes..viviParameterTypes.float"></a>

#### viviParameterTypes.float(obj) ⇒ <code>float</code>
Float number
min/max are very buggy and break Vivi sometimes, so we don’t use them

**Kind**: static method of [<code>viviParameterTypes</code>](#module_parameterTypes..viviParameterTypes)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| obj.name | <code>string</code> | name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit) |
| obj.description | <code>string</code> | extended description for Vivi interface, appears on hover |
| obj.label | <code>string</code> | Label displayed in vivi. |
| obj.defaultValue | <code>float</code> | default value |
| obj.required | <code>boolean</code> |  |

**Example**  
```js
float({
   name: 'myNumber',
   label: 'Meine Nummer',
   defaultValue: 5.5,
})
```
<a name="module_parameterTypes..viviParameterTypes.datetime"></a>

#### viviParameterTypes.datetime(obj) ⇒ <code>string</code>
Datetime
Haven’t figured out how to set a default value yet

**Kind**: static method of [<code>viviParameterTypes</code>](#module_parameterTypes..viviParameterTypes)  
**Returns**: <code>string</code> - ISO-formatted datetime string in UTC like "2022-02-22T00:22:22+00:00" or your custom format  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| obj.name | <code>string</code> | name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit) |
| obj.description | <code>string</code> | extended description for Vivi interface, appears on hover |
| obj.label | <code>string</code> | Label displayed in vivi. |
| obj.format | <code>string</code> | Custom datetime format, see https://babel.pocoo.org/en/latest/dates.html#date-fields (it’s super weird) |
| obj.required | <code>boolean</code> |  |

**Example**  
```js
date({
   name: 'myDatetime',
   label: 'Mein Datum und meine Uhrzeit',
})
```
<a name="module_parameterTypes..viviParameterTypes.isTruncatedByPaywall"></a>

#### viviParameterTypes.isTruncatedByPaywall(obj) ⇒ <code>boolean</code>
Indicates whether the paywall is active or not

**Kind**: static method of [<code>viviParameterTypes</code>](#module_parameterTypes..viviParameterTypes)  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

**Example**  
```js
isTruncatedByPaywall()
```
<a name="module_parameterTypes..viviParameterTypes.isRebrushed"></a>

#### viviParameterTypes.isRebrushed(obj) ⇒ <code>boolean</code>
Indicates whether the page has received the rebrush yet

**Kind**: static method of [<code>viviParameterTypes</code>](#module_parameterTypes..viviParameterTypes)  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

**Example**  
```js
isRebrushed()
```
<a name="module_parameterTypes..viviParameterTypes.pagetype"></a>

#### viviParameterTypes.pagetype(obj) ⇒ <code>String</code>
Pagetype, `"cp"` for homepage/CPs, `"article"` for articles

**Kind**: static method of [<code>viviParameterTypes</code>](#module_parameterTypes..viviParameterTypes)  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

**Example**  
```js
pagetype()
```
<a name="module_parameterTypes..viviParameterTypes.isUniqueId"></a>

#### viviParameterTypes.isUniqueId(obj) ⇒ <code>String</code>
isUniqueId

**Kind**: static method of [<code>viviParameterTypes</code>](#module_parameterTypes..viviParameterTypes)  

| Param | Type |
| --- | --- |
| obj | <code>Object</code> | 

**Example**  
```js
uniqueId()
```
<a name="module_parameterTypes..viviParameterTypes.parameterCount"></a>

#### viviParameterTypes.parameterCount(obj) ⇒ <code>Number</code>
Counts the number of filled out parameters, e.g. strings
WARNING: only tested with strings for now
If you use numbers, you need to add a case for 0

**Kind**: static method of [<code>viviParameterTypes</code>](#module_parameterTypes..viviParameterTypes)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| obj.name | <code>string</code> | name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit) |
| obj.parametersToCount | <code>Array.&lt;string&gt;</code> | which params to count |

**Example**  
```js
parameterCount({
 name: 'numberOfDatawrapperIds',
 parametersToCount: ['datawrapperId1', 'datawrapperId2', 'datawrapperId3']
})
```
<a name="module_parameterTypes..viviParameterTypes.static"></a>

#### viviParameterTypes.static(obj) ⇒ <code>String(value)</code>
A static string. Use this if you have multiple embeds and want different props for them,
without them being configurable by editors (e.g. a header embed and an article embed)

**Kind**: static method of [<code>viviParameterTypes</code>](#module_parameterTypes..viviParameterTypes)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| obj.name | <code>string</code> | name for React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit) |
| obj.value | <code>string</code> | value for prop * string({    name: 'display',    value: 'header', }) |

<a name="module_parameterTypes..viviParameterTypes.imageGroup"></a>

#### viviParameterTypes.imageGroup(obj) ⇒ <code>object</code>
Image group

**Kind**: static method of [<code>viviParameterTypes</code>](#module_parameterTypes..viviParameterTypes)  

| Param | Type | Description |
| --- | --- | --- |
| obj | <code>Object</code> |  |
| obj.name | <code>string</code> | name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit) |
| obj.description | <code>string</code> | extended description for Vivi interface, appears on hover |
| obj.label | <code>string</code> | Label displayed in vivi. |
| obj.imgFormat | <code>string</code> | Format of the image e.g. 'square'. Possible values are square and wide. |
| obj.parameterAsImgFormat | <code>string</code> | Name of another vivi parameter to use as a value for the image format. |
| obj.required | <code>boolean</code> |  |

**Example**  
```js
viviParameterTypes.oneOf({
   name: 'imgFormat',
   label: 'Bildformat',
   options: [
     {label: 'Quadratisch', propValue: 'square'},
     {label: 'Breit', propValue: 'wide'},
   ],
}),

viviParameterTypes.imageGroup({
   name: 'img1',
   label: 'Bild 1',
   parameterAsImgFormat: 'imgFormat',
})

// Page
 <ViviEmbed
    img1='{
      "src": "https://img.zeit.de/campus/2023-02/bild-arbeitsvertrag-ansprueche-bezahlung-urlaub-ueberstunden/square",
      "alt": "",
      "copyright": "© Getty Images"
    }'
  />
```
