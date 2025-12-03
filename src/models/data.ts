export interface IOption<K extends string | number, V>{
    id: K;
    name: V;
}

export class VariationDef implements IOption<string, string> {
    name: string;
    id: string;

    constructor(id: string, name: string) {
        this.id=id;
        this.name = name;
    }
}

export interface Conversion {
    variationId: string;
    value: number;
}

export class VariationData{
    date: number;
    variationId: string;
    conversionRate: number;

    constructor(date: number, variationId: string, conversionRate: number) {
        this.date=date;
        this.variationId = variationId;
        this.conversionRate = conversionRate;
    }
}

export interface Variation{
    variationId: string,
    items: VariationData[]
};

export class VariationDate implements IOption<number, string> {
    name: string;
    id: number;

    constructor(id: number, name: string) {
        this.id=id;
        this.name = name;
    }
}
