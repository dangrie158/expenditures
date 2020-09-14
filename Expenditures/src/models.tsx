
export class Tag {
    id: number = -1
    name: string = ""
    color: string = "primary"
    icon: string = "add"
    sum?: number = 0
    by_year?: Array<[string, number]> = []
    by_month?: Array<[string, number]> = []
}

export class Expenditure {
    username: string = "n/a"
    amount: number = 0
    reason: string = "n/a"
    id: number = -1
    tags: Array<Tag> = []
}
