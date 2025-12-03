import Select, { type MultiValue } from "react-select";
import type { IOption } from "../models/data";

interface Props<V>{
    data: IOption<string | number, V>[]
    onChange: (selected: MultiValue<IOption<string,V>> )=>void;
    placeholder: string
}

const ChartFilter = <V,>({ data  = [], onChange, placeholder }: Props<V>) => {
 
    const handleChange = (selected: MultiValue<IOption<string,V>>) => {
        onChange(selected);
    };

    const customStyles = {
        control: (base: any) => ({
            ...base,
            height: '25px',
            lineHeight: '15px',
            fontSize: '13px',
            minHeight: '25px',
            minWidth: '50px',
            '& div': {
                padding: '0px'
                },
         }),
        multiValue: (base: any) => ({
            ...base,
            height:'20px',
            lineHeight: '20px',
            fontSize: '15px',
            margin: '1px'
        }),
        indicatorContainer:(base: any) => ({
            ...base,
            height: '10px',
            width: '10px',
            '& svg': {
                width: '10px', 
                height: '10px' 
            },
        }),
        dropdownIndicator: (base: any) => ({
            ...base,
            '& svg': {
            width: '16px',
            height: '16px',
            },
        }),
        option:(base: any) => ({
            ...base,
            lineHeight: '20px',
            fontSize: '15px'
        }),
    };
    return (
        <div className="filterContainer">
            <Select isMulti
                options={data} 
                // @ts-ignore
                getOptionLabel={option => option.name}
                // @ts-ignore
                getOptionValue={option => option.id}
                // @ts-ignore
                onChange={handleChange}
                placeholder={placeholder}
                styles={customStyles}
            />
        </div>
    )
};

export default ChartFilter;
