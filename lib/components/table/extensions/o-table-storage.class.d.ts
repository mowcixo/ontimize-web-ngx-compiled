import { OTableConfiguration } from '../../../types/o-table-configuration.type';
import { OTableFiltersStatus } from '../../../types/o-table-filter-status.type';
import { OTableComponent } from '../o-table.component';
export declare class OTableStorage {
    protected table: OTableComponent;
    static STORED_FILTER_KEY: string;
    static USER_STORED_FILTERS_KEY: string;
    static STORED_CONFIGURATION_KEY: string;
    static STORED_PROPERTIES_KEY: string;
    static STORED_CONFIGURATIONS_KEY: string;
    constructor(table: OTableComponent);
    getDataToStore(): {
        filter: string;
    };
    getTablePropertiesToStore(properties: string[]): {};
    getTablePropertyToStore(property: string): {};
    getFilterColumnsState(): any;
    reset(): void;
    protected getSortState(): {};
    protected getFilterColumnActiveByDefaultState(): {};
    protected getColumnFiltersState(): {};
    protected getColumnsDisplayState(): {};
    protected getColumnsQuickFilterState(): any;
    protected getPageState(): any;
    protected getSelectionState(): any;
    protected getInitialConfigurationState(): any;
    setStoredFilters(filters: Array<OTableFiltersStatus>): OTableFiltersStatus[];
    getStoredFilters(): any;
    getStoredFilter(filterName: string): any;
    getStoredFilterConf(filterName: string): any;
    deleteStoredFilter(filterName: string): void;
    storeFilter(filterArgs: OTableFiltersStatus): void;
    getStoredColumnsFilters(arg?: any): any;
    getStoredFiltersColumns(arg?: any): any;
    getStoredConfigurations(): any;
    getStoredConfiguration(configurationName: string): any;
    storeConfiguration(configurationAgs: OTableConfiguration, tableProperties: any[]): void;
    deleteStoredConfiguration(configurationName: string): void;
}
