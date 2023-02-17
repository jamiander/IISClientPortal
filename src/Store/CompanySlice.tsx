export interface Company {
    id: number,
    name: string,
    initiatives?: number[]
}

export interface CompanyState {
    companies: Company[],
    currentCompanyId: number
}