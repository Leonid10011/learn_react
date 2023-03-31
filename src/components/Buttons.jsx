export const CustomButton = ({id, name, handleClick, ...rest}) => {
    return(
        <>
            <button type="button" id={id} onClick={handleClick}>{name}</button>
        </>
    )
}

const RadioButton = ({label, value, onChange}) => {
return(
    <>
    <input type="radio" value={value} onChange={onChange} />
    {label}
    </>
);
}

const CheckButton = ({label, value, onChange}) => {
return(
    <>
    <input type="checkbox" value={value} onChange={onChange}/>
    {label}
    </>
);
}

export const Dropdown = ({value, onClick}) => {
    const handleClick = (event) => {
        onClick(!value);
    }

    return(
        <>
        <button onClick={handleClick}>Dropdown</button>
        {value ? (
        <ul className="menu">
            <li className="menu-item">
            <button>Menu 1</button>
            </li>
            <li className="menu-item">
            <button>Menu 2</button>
            </li>
        </ul>
        ) : null}
        {value ? <div>Is Open</div> : <div>Is Closed</div>}
        </>
    );
}
