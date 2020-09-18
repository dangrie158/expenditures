
export class Summary {
    total: number = 0;
    by_year: Array<[string, number]> = []
    by_month: Array<[string, number]> = []
}

export class Tag extends Summary {
    id: number = -1
    name: string = ""
    color: string = "primary"
    icon: string = "add"
    sum?: number = 0
}

export class Expenditure {
    username: string = ""
    amount: number = 0
    reason: string = ""
    id: number = -1
    tags: Array<Tag> = []
    created_date = ""
}
