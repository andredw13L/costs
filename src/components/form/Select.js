import styles from './Select.module.css'

function Select({ text, name, options, handleOnChange, value }) {
    return (
        <div className={styles.select_control}>
            <label htmlFor={name}>{text}:</label>
            <select name={name} id={name} defaultValue={'Default'}>
                <option disabled value="Default">Selecione uma opção</option>
            </select>
        </div>
    )
}

export default Select