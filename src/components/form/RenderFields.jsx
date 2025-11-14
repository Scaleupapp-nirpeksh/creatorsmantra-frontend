import { GridContainer, GridItem } from '../wrapper/GridContainer'
import TextInput from './TextInput'
import Dropdown from './Dropdown'
import TextArea from './TextArea'
import TagsInput from './TagsInput'

const RenderSection = ({ attrs, onChange, formState, parentKey = null }) => {
  const {
    uid,
    label,
    name,
    component,
    type,
    options,
    style,
    required,
    default: defaultValue,
    placeholder,
  } = attrs

  let value = formState?.[name]?.value ?? ''
  if (parentKey && formState?.[parentKey]?.isGroupedField) {
    const flatMapData = formState?.[parentKey].group?.flatMap((g) => Object.entries(g))
    const flatMapDotMap = flatMapData?.filter((f) => f?.[0] === uid)
    value = flatMapDotMap?.find((x) => x !== undefined)?.[1]?.value

    // value = formState?.[parentKey].group
    //   ?.flatMap((g) => g)
    //   ?.map((f) => f?.[uid])
    //   ?.find((x) => x !== undefined)?.value
  }

  return (
    <>
      {component === 'textInput' && (
        <TextInput
          name={name}
          label={label}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          error={formState?.[name]?.error}
        />
      )}
      {component === 'dropdown' && (
        <Dropdown
          name={name}
          label={label}
          options={options}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          error={formState?.[name]?.error}
        />
      )}
      {component === 'textArea' && (
        <TextArea
          name={name}
          label={label}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          error={formState?.[name]?.error}
        />
      )}
      {component === 'tagsInput' && (
        <TagsInput
          name={name}
          label={label}
          placeholder={placeholder}
          required={required}
          tags={value ?? []}
          onChange={onChange}
          error={formState?.[name]?.error}
        />
      )}
    </>
  )
}

const RenderFields = ({ formKeys, formState, onChange }) => {
  const { id, isRequired, label, name, field, type, customStyle, placeholder, options, showIf } =
    formKeys

  return (
    <GridItem key={id} customStyleCls={customStyle}>
      {field === 'text' && (
        <TextInput
          name={name}
          label={label}
          type={type}
          placeholder={placeholder}
          required={isRequired}
          error={formState?.[name].error}
          value={formState?.[name].value}
          onChange={onChange}
        />
      )}
      {field === 'dropdown' && (
        <Dropdown
          name={name}
          label={label}
          options={options}
          placeholder={placeholder}
          required={isRequired}
          value={formState[name].value}
          error={formState?.[name].error}
          onChange={onChange}
        />
      )}
      {field === 'textarea' && (
        <TextArea
          name={name}
          label={label}
          placeholder={placeholder}
          required={isRequired}
          error={formState?.[name].error}
          value={formState?.[name].value}
          onChange={onChange}
        />
      )}
      {field === 'tagsinput' && (
        <TagsInput
          name={name}
          label={label}
          placeholder={placeholder}
          required={isRequired}
          error={formState?.[name]?.error}
          tags={formState?.[name]}
          customStyle={customStyle}
          onChange={onChange}
        />
      )}
    </GridItem>
  )
}

const RenderCompoundFields = ({ formSection, formState, onChange }) => {
  const formFields = formSection.formFields
  return (
    <>
      {formFields?.compoundFields?.fields.map((group, idx) => (
        <GridContainer key={idx}>
          {formFields.compoundFields.fields.map((field) => (
            <RenderFields
              key={field.id}
              formKeys={field}
              formState={formState}
              onChange={onChange}
            />
          ))}
        </GridContainer>
      ))}
    </>
  )
}

export { RenderFields, RenderCompoundFields, RenderSection }
