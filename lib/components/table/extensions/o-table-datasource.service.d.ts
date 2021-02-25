import { OTableComponent } from '../o-table.component';
import { DefaultOTableDataSource } from './default-o-table.datasource';
export declare class OTableDataSourceService {
    constructor();
    getInstance(table: OTableComponent): DefaultOTableDataSource;
}
