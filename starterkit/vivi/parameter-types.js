/**
 * @module parameterTypes
 */

import range from 'core/utils/range';
import {jsBoolToPython} from './utils.js';

function getDescription(description) {
  if (!description) {
    return '';
  }
  return `\n        description=u"${description}",`;
}

function getDangerouslyMakeOptionalOptions(__dangerouslyMakeOptional, name) {
  if (__dangerouslyMakeOptional) {
    return {
      iterate: ['False', `{{ module.params.${name} }}`],
      iterateIfElse: true,
    };
  }
  return {};
}

/**
 * viviParameterTypes
 */
const viviParameterTypes = {
  /**
   * A string without linebreaks
   * @param {Object} obj
   * @param {string} obj.name - name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit)
   * @param {string} obj.description - extended description for Vivi interface, appears on hover
   * @param {string} obj.label - Label displayed in vivi.
   * @param {integer|null} obj.maxLength - max length for text
   * @param {boolean} obj.required
   * @param {boolean} obj.escape - html escape string in vivi
   * * string({
   *    name: 'headline',
   *    label: 'Überschrift',
   *    maxLength: 64,
   * })
   * @returns {String}
   */
  string: ({
    name,
    description,
    label,
    maxLength = null,
    required = false,
    escape = true,
    __dangerouslyMakeOptional = false,
  }) => {
    const maxLengthDefinition =
      maxLength !== null ? `\n          max_length=${maxLength},` : '';

    return {
      name,
      description,
      jinjaVarName: `module.params.${name}`,
      allowedInStaticIncludes: false,
      parameterString: `zope.schema.TextLine(
        title=u"${label}",${getDescription(description)}${maxLengthDefinition}
        required=${jsBoolToPython(required)},
      )`,
      escape,
      ...getDangerouslyMakeOptionalOptions(__dangerouslyMakeOptional, name),
    };
  },
  /**
   * A multiline string. Warning: removes all linebreaks, so mainly for editing comfort
   * @param {Object} obj
   * @param {string} obj.name - name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit)
   * @param {string} obj.description - extended description for Vivi interface, appears on hover
   * @param {string} obj.label - Label displayed in vivi.
   * @param {boolean} obj.required
   * @param {boolean} obj.escape - html escape string in vivi
   * text({
   *    name: 'paragraph',
   *    label: 'Absatz',
   * })
   * @returns {String}
   */
  text: ({
    name,
    description,
    label,
    required = false,
    escape = true,
    __dangerouslyMakeOptional = false,
  }) => {
    return {
      name,
      description,
      jinjaVarName: `module.params.${name} | replace("\\n", "")`,
      allowedInStaticIncludes: false,
      iterate: false,
      parameterString: `zope.schema.Text(
        title=u"${label}",${getDescription(description)}
        required=${jsBoolToPython(required)},
      )`,
      valueInSingleQuotes: true,
      escape,
      ...getDangerouslyMakeOptionalOptions(__dangerouslyMakeOptional, name),
    };
  },
  /**
   * Array of strings, renders a dropdown in Vivi
   * @param {Object} obj
   * @param {string} obj.name - name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit)
   * @param {string} obj.description - extended description for Vivi interface, appears on hover
   * @param {Object[]} obj.options - Available options for this parameter.
   * @param {string} obj.options[].label - The label for this option displayed in vivi.
   * @param {string} obj.options[].propValue - The value passed as a prop to the app if this options is selected.
   * @param {boolean} obj.required
   * @example
   * oneOf({
   *  name: 'display',
   *  label: 'Zeige',
   *  options: [
   *    {label: 'Liniendiagramm Mutationen', propValue: 'mutation-line-chart'}
   *    {label: 'Liniendiagramm Tests', propValue: 'test-line-chart'}
   *  ]
   * })
   * @returns {String}
   */
  oneOf: ({
    name,
    description,
    label,
    options,
    defaultValue = options[0],
    required = false,
  }) => {
    return {
      name,
      description,
      jinjaVarName: `module.params.${name}`,
      allowedInStaticIncludes: true,
      iterate: options.map((d) => `"${d.propValue}"`),
      parameterString: `zope.schema.Choice(
        title="${label}",${getDescription(description)}
        source=zeit.cms.content.sources.SimpleFixedValueSource(
          collections.OrderedDict(
            [
              ${options
                .map((option) => `("${option.propValue}", "${option.label}"),`)
                .join('\n              ')}
            ]
          )
        ),
        default="${defaultValue.propValue}",
        required=${jsBoolToPython(required)},
      )`,
    };
  },
  /**
   * Boolean, renders a checkbox in Vivi
   * @param {Object} obj
   * @param {string} obj.name - name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit)
   * @param {string} obj.description - extended description for Vivi interface, appears on hover
   * @param {string} obj.label - Label displayed in vivi.
   * @param {boolean} obj.required - Whether this parameter is required or not.
   * @param {boolean} obj.defaultValue - Default value for this parameter.
   * @example
   * boolean({
   *  name: 'collapsed',
   *  label: 'Eingeklappt',
   *  defaultValue: false
   * })
   * @returns {boolean}
   */
  boolean: ({
    name,
    description,
    label,
    defaultValue = false,
    required = false,
  }) => {
    return {
      name,
      description,
      jinjaVarName: `module.params.${name}`,
      allowedInStaticIncludes: true,
      iterate: ['True', 'False'],
      iterateIfElse: true,
      parameterString: `zope.schema.Bool(
        title="${label}",${getDescription(description)}
        default=${jsBoolToPython(defaultValue)},
        required=${jsBoolToPython(required)},
      )`,
    };
  },
  /**
   * Integer number
   * min/max are very buggy and break Vivi sometimes, so we don’t use them
   * @param {Object} obj
   * @param {string} obj.name - name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit)
   * @param {string} obj.description - extended description for Vivi interface, appears on hover
   * @param {string} obj.label - Label displayed in vivi.
   * @param {integer} obj.defaultValue - default value
   * @param {boolean} obj.required
   * @example
   * integer({
   *    name: 'myNumber',
   *    label: 'Meine Nummer',
   *    defaultValue: 10,
   * })
   * @returns {integer}
   */
  integer: ({name, description, label, defaultValue = 0, required = false}) => {
    return {
      name,
      description,
      jinjaVarName: `module.params.${name}`,
      allowedInStaticIncludes: false,
      parameterString: `zope.schema.Int(
        title="${label}",${getDescription(description)}
        default=${defaultValue},
        required=${jsBoolToPython(required)},
      )`,
    };
  },
  /**
   * Float number
   * min/max are very buggy and break Vivi sometimes, so we don’t use them
   * @param {Object} obj
   * @param {string} obj.name - name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit)
   * @param {string} obj.description - extended description for Vivi interface, appears on hover
   * @param {string} obj.label - Label displayed in vivi.
   * @param {float} obj.defaultValue - default value
   * @param {boolean} obj.required
   * @example
   * float({
   *    name: 'myNumber',
   *    label: 'Meine Nummer',
   *    defaultValue: 5.5,
   * })
   * @returns {float}
   */
  float: ({name, description, label, defaultValue = 0, required = false}) => {
    return {
      name,
      description,
      jinjaVarName: `module.params.${name}`,
      allowedInStaticIncludes: false,
      parameterString: `zope.schema.Float(
        title="${label}",${getDescription(description)}
        default=float(${defaultValue}),
        required=${jsBoolToPython(required)},
      )`,
    };
  },
  /**
   * Datetime
   * Haven’t figured out how to set a default value yet
   * @param {Object} obj
   * @param {string} obj.name - name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit)
   * @param {string} obj.description - extended description for Vivi interface, appears on hover
   * @param {string} obj.label - Label displayed in vivi.
   * @param {string} obj.format - Custom datetime format, see https://babel.pocoo.org/en/latest/dates.html#date-fields (it’s super weird)
   * @param {boolean} obj.required
   * @example
   * date({
   *    name: 'myDatetime',
   *    label: 'Mein Datum und meine Uhrzeit',
   * })
   * @returns {string} ISO-formatted datetime string in UTC like "2022-02-22T00:22:22+00:00" or your custom format
   */
  datetime: ({name, description, label, required = false, format = null}) => {
    let jinjaVarName = `module.params.${name}`;
    let customJinjaCode = null;

    if (format) {
      customJinjaCode = `{%- set ${name} = module.params.${name} | format_date(None, '${format}') %}`;
      jinjaVarName = name;
    }

    return {
      name,
      description,
      jinjaVarName,
      allowedInStaticIncludes: false,
      parameterString: `zope.schema.Datetime(
        title="${label}",${getDescription(description)}
        required=${jsBoolToPython(required)},
      )`,
      customJinjaCode,
    };
  },
  /**
   * Indicates whether the paywall is active or not
   * @param {Object} obj
   * @example
   * isTruncatedByPaywall()
   * @returns {boolean}
   */
  isTruncatedByPaywall: () => {
    return {
      name: 'isTruncatedByPaywall',
      jinjaVarName: 'paywall',
      allowedInStaticIncludes: true,
      iterate: ['True', 'False'],
      iterateIfElse: true,
      parameterString: null,
      customJinjaCode: `{%- set paywall = (request.paywall.status != None) %}
{% if paywall %}
{{ "<script>document.documentElement.dataset.isTruncatedByPaywall = true</script>" | include_in_head }}
{% endif %}`,
    };
  },
  /**
   * Indicates whether the page has received the rebrush yet
   * @param {Object} obj
   * @example
   * isRebrushed()
   * @returns {boolean}
   */
  isRebrushed: () => {
    return {
      name: 'isRebrushed',
      jinjaVarName: 'rebrushed',
      allowedInStaticIncludes: true,
      iterate: ['True', 'False'],
      iterateIfElse: true,
      parameterString: null,
      customJinjaCode: `{%- set rebrushed = view.rebrushed %}`,
    };
  },
  /**
   * Pagetype, `"cp"` for homepage/CPs, `"article"` for articles
   * @param {Object} obj
   * @example
   * pagetype()
   * @returns {String}
   */
  pagetype: () => {
    return {
      name: 'pagetype',
      jinjaVarName: 'pagetype',
      allowedInStaticIncludes: true,
      iterate: ['"article"', '"cp"'],
      parameterString: null,
      customJinjaCode: `{% if provides(context, 'zeit.content.article.interfaces.IArticle') %}
  {%- set pagetype="article" %}
{% else %}
  {%- set pagetype="cp" %}
{% endif %}
`,
    };
  },
  /**
   * isUniqueId
   * @param {Object} obj
   * @example
   * uniqueId()
   * @returns {String}
   */
  isUniqueId: ({name, uniqueId}) => {
    const uniqueIdArray = (Array.isArray(uniqueId) ? uniqueId : [uniqueId])
      .map((d) => `"${d}"`)
      .join(', ');

    return {
      name,
      jinjaVarName: `isUniqueId_${name}`,
      allowedInStaticIncludes: true,
      iterate: ['True', 'False'],
      parameterString: null,
      customJinjaCode: `{%- set isUniqueId_${name} = False %}
{% if provides(context, 'zeit.content.article.interfaces.IArticle') %}
  {% if context.uniqueId in [${uniqueIdArray}] %}
    {%- set isUniqueId_${name} = True %}
  {% endif %}
{% endif %}
`,
    };
  },
  /**
   * Counts the number of filled out parameters, e.g. strings
   * WARNING: only tested with strings for now
   * If you use numbers, you need to add a case for 0
   * @param {Object} obj
   * @param {string} obj.name - name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit)
   * @param {string[]} obj.parametersToCount - which params to count
   * @example
   * parameterCount({
   *  name: 'numberOfDatawrapperIds',
   *  parametersToCount: ['datawrapperId1', 'datawrapperId2', 'datawrapperId3']
   * })
   * @returns {Number}
   */
  parameterCount: ({name, parametersToCount}) => {
    const ifs = parametersToCount
      .map((parameterToCount) => {
        return `{% if module.params.${parameterToCount} %}{% set ${name} = ${name} + 1 %}{% endif %}`;
      })
      .join('\n');

    return {
      name,
      jinjaVarName: name,
      allowedInStaticIncludes: false,
      parameterString: null,
      iterate: range(0, parametersToCount.length + 1),
      compute: (props = {}) => {
        const propNames = Object.keys(props);
        return parametersToCount.reduce((count, parameterToCount) => {
          if (propNames.includes(parameterToCount)) {
            count += 1;
          }
          return count;
        }, 0);
      },
      customJinjaCode: `
{% set ${name} = 0 %}
${ifs}`,
    };
  },
  /**
   * A static string. Use this if you have multiple embeds and want different props for them,
   * without them being configurable by editors (e.g. a header embed and an article embed)
   * @param {Object} obj
   * @param {string} obj.name - name for React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit)
   * @param {string} obj.value - value for prop
   * * string({
   *    name: 'display',
   *    value: 'header',
   * })
   * @returns {String(value)}
   */
  static: ({name, value}) => {
    return {
      name,
      value,
      static: true,
    };
  },
  /**
   * Image group
   * @param {Object} obj
   * @param {string} obj.name - name for Vivi variable and React prop, must a valid Python variable name /[a-z]|[A-Z]|[0-9]|_/ (cannot start with a digit)
   * @param {string} obj.description - extended description for Vivi interface, appears on hover
   * @param {string} obj.label - Label displayed in vivi.
   * @param {string} obj.imgFormat - Format of the image e.g. 'square'. Possible values are square and wide.
   * @param {string} obj.parameterAsImgFormat - Name of another vivi parameter to use as a value for the image format.
   * @param {boolean} obj.required
   * @example
   *
   * viviParameterTypes.oneOf({
   *    name: 'imgFormat',
   *    label: 'Bildformat',
   *    options: [
   *      {label: 'Quadratisch', propValue: 'square'},
   *      {label: 'Breit', propValue: 'wide'},
   *    ],
   * }),
   *
   * viviParameterTypes.imageGroup({
   *    name: 'img1',
   *    label: 'Bild 1',
   *    parameterAsImgFormat: 'imgFormat',
   * })
   *
   * // Page
   *  <ViviEmbed
   *     img1='{
   *       "src": "https://img.zeit.de/campus/2023-02/bild-arbeitsvertrag-ansprueche-bezahlung-urlaub-ueberstunden/square",
   *       "alt": "",
   *       "copyright": "© Getty Images"
   *     }'
   *   />
   *
   * @returns {object}
   */
  imageGroup: ({
    name,
    description,
    label,
    imgFormat,
    parameterAsImgFormat,
    required = false,
  }) => {
    return {
      name,
      description,
      valueInSingleQuotes: true,
      value: `{"src": "{{ ${name}_src }}", "copyright": "{{ ${name}_copyright }}", "alt": "{{ ${name}_alt }}"}`,
      jinjaVarName: name,
      allowedInStaticIncludes: false,
      iterate: false,
      parameterString: `zope.schema.Choice(
        title="${label}",${getDescription(description)}
        source=zeit.content.image.interfaces.imageSource,
        required=${jsBoolToPython(required)},
      )`,
      customJinjaCode: `{% if module.params.${name} %}{%- set ${name} = get_image(module.params.${name}, variant_id=${
        `module.params.${parameterAsImgFormat}` || `"${imgFormat}"`
      }, fallback=False) %}{% set ${name}_src = request.image_host + ${name}.path %}{% set ${name}_copyright = ${name}.copyright.text %}{% set ${name}_alt = ${name}.alt %}{% endif %}`,
    };
  },
};

export default viviParameterTypes;
