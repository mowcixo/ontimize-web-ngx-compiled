export class SQLTypes {
    static getSQLTypeValue(type) {
        let value;
        type = type ? type.toUpperCase() : '';
        switch (type) {
            case 'BIT':
                value = SQLTypes.BIT;
                break;
            case 'TINYINT':
                value = SQLTypes.TINYINT;
                break;
            case 'SMALLINT':
                value = SQLTypes.SMALLINT;
                break;
            case 'INTEGER':
                value = SQLTypes.INTEGER;
                break;
            case 'BIGINT':
                value = SQLTypes.BIGINT;
                break;
            case 'FLOAT':
                value = SQLTypes.FLOAT;
                break;
            case 'REAL':
                value = SQLTypes.REAL;
                break;
            case 'DOUBLE':
                value = SQLTypes.DOUBLE;
                break;
            case 'NUMERIC':
                value = SQLTypes.NUMERIC;
                break;
            case 'DECIMAL':
                value = SQLTypes.DECIMAL;
                break;
            case 'CHAR':
                value = SQLTypes.CHAR;
                break;
            case 'VARCHAR':
                value = SQLTypes.VARCHAR;
                break;
            case 'LONGVARCHAR':
                value = SQLTypes.LONGVARCHAR;
                break;
            case 'DATE':
                value = SQLTypes.DATE;
                break;
            case 'TIME':
                value = SQLTypes.TIME;
                break;
            case 'TIMESTAMP':
                value = SQLTypes.TIMESTAMP;
                break;
            case 'BINARY':
                value = SQLTypes.BINARY;
                break;
            case 'VARBINARY':
                value = SQLTypes.VARBINARY;
                break;
            case 'LONGVARBINARY':
                value = SQLTypes.LONGVARBINARY;
                break;
            case 'NULL':
                value = SQLTypes.NULL;
                break;
            case 'OTHER':
                value = SQLTypes.OTHER;
                break;
            case 'JAVA_OBJECT':
                value = SQLTypes.JAVA_OBJECT;
                break;
            case 'DISTINCT':
                value = SQLTypes.DISTINCT;
                break;
            case 'STRUCT':
                value = SQLTypes.STRUCT;
                break;
            case 'ARRAY':
                value = SQLTypes.ARRAY;
                break;
            case 'BLOB':
                value = SQLTypes.BLOB;
                break;
            case 'CLOB':
                value = SQLTypes.CLOB;
                break;
            case 'REF':
                value = SQLTypes.REF;
                break;
            case 'DATALINK':
                value = SQLTypes.DATALINK;
                break;
            case 'BOOLEAN':
                value = SQLTypes.BOOLEAN;
                break;
            case 'ROWID':
                value = SQLTypes.ROWID;
                break;
            case 'NCHAR':
                value = SQLTypes.NCHAR;
                break;
            case 'NVARCHAR':
                value = SQLTypes.NVARCHAR;
                break;
            case 'LONGNVARCHAR':
                value = SQLTypes.LONGNVARCHAR;
                break;
            case 'NCLOB':
                value = SQLTypes.NCLOB;
                break;
            case 'SQLXML':
                value = SQLTypes.SQLXML;
                break;
            case 'BASE64':
                value = SQLTypes.BASE64;
                break;
            default:
                value = SQLTypes.OTHER;
                break;
        }
        return value;
    }
    static getSQLTypeKey(type) {
        let value;
        switch (type) {
            case SQLTypes.BIT:
                value = 'BIT';
                break;
            case SQLTypes.TINYINT:
                value = 'TINYINT';
                break;
            case SQLTypes.SMALLINT:
                value = 'SMALLINT';
                break;
            case SQLTypes.INTEGER:
                value = 'INTEGER';
                break;
            case SQLTypes.BIGINT:
                value = 'BIGINT';
                break;
            case SQLTypes.FLOAT:
                value = 'FLOAT';
                break;
            case SQLTypes.REAL:
                value = 'REAL';
                break;
            case SQLTypes.DOUBLE:
                value = 'DOUBLE';
                break;
            case SQLTypes.NUMERIC:
                value = 'NUMERIC';
                break;
            case SQLTypes.DECIMAL:
                value = 'DECIMAL';
                break;
            case SQLTypes.CHAR:
                value = 'CHAR';
                break;
            case SQLTypes.VARCHAR:
                value = 'VARCHAR';
                break;
            case SQLTypes.LONGVARCHAR:
                value = 'LONGVARCHAR';
                break;
            case SQLTypes.DATE:
                value = 'DATE';
                break;
            case SQLTypes.TIME:
                value = 'TIME';
                break;
            case SQLTypes.TIMESTAMP:
                value = 'TIMESTAMP';
                break;
            case SQLTypes.BINARY:
                value = 'BINARY';
                break;
            case SQLTypes.VARBINARY:
                value = 'VARBINARY';
                break;
            case SQLTypes.LONGVARBINARY:
                value = 'LONGVARBINARY';
                break;
            case SQLTypes.NULL:
                value = 'NULL';
                break;
            case SQLTypes.OTHER:
                value = 'OTHER';
                break;
            case SQLTypes.JAVA_OBJECT:
                value = 'JAVA_OBJECT';
                break;
            case SQLTypes.DISTINCT:
                value = 'DISTINCT';
                break;
            case SQLTypes.STRUCT:
                value = 'STRUCT';
                break;
            case SQLTypes.ARRAY:
                value = 'ARRAY';
                break;
            case SQLTypes.BLOB:
                value = 'BLOB';
                break;
            case SQLTypes.CLOB:
                value = 'CLOB';
                break;
            case SQLTypes.REF:
                value = 'REF';
                break;
            case SQLTypes.DATALINK:
                value = 'DATALINK';
                break;
            case SQLTypes.BOOLEAN:
                value = 'BOOLEAN';
                break;
            case SQLTypes.ROWID:
                value = 'ROWID';
                break;
            case SQLTypes.NCHAR:
                value = 'NCHAR';
                break;
            case SQLTypes.NVARCHAR:
                value = 'NVARCHAR';
                break;
            case SQLTypes.LONGNVARCHAR:
                value = 'LONGNVARCHAR';
                break;
            case SQLTypes.NCLOB:
                value = 'NCLOB';
                break;
            case SQLTypes.SQLXML:
                value = 'SQLXML';
                break;
            case SQLTypes.BASE64:
                value = 'BASE64';
                break;
            default:
                value = 'OTHER';
                break;
        }
        return value;
    }
    static parseUsingSQLType(arg, type) {
        let value = arg;
        type = type ? type.toUpperCase() : '';
        try {
            switch (type) {
                case 'TINYINT':
                case 'SMALLINT':
                case 'INTEGER':
                case 'BIGINT':
                    value = Number(arg);
                    break;
                case 'FLOAT':
                case 'REAL':
                case 'DOUBLE':
                case 'NUMERIC':
                case 'DECIMAL':
                    value = parseFloat(arg);
                    break;
                default:
                    break;
            }
        }
        catch (err) {
            console.error('SQLTypes.parseUsingSQLType error');
        }
        return value;
    }
    static isNumericSQLType(arg) {
        return [
            SQLTypes.TINYINT,
            SQLTypes.SMALLINT,
            SQLTypes.INTEGER,
            SQLTypes.BIGINT,
            SQLTypes.FLOAT,
            SQLTypes.REAL,
            SQLTypes.DOUBLE,
            SQLTypes.NUMERIC,
            SQLTypes.DECIMAL
        ].indexOf(arg) !== -1;
    }
}
SQLTypes.BIT = -7;
SQLTypes.TINYINT = -6;
SQLTypes.SMALLINT = 5;
SQLTypes.INTEGER = 4;
SQLTypes.BIGINT = -5;
SQLTypes.FLOAT = 6;
SQLTypes.REAL = 7;
SQLTypes.DOUBLE = 8;
SQLTypes.NUMERIC = 2;
SQLTypes.DECIMAL = 3;
SQLTypes.CHAR = 1;
SQLTypes.VARCHAR = 12;
SQLTypes.LONGVARCHAR = -1;
SQLTypes.DATE = 91;
SQLTypes.TIME = 92;
SQLTypes.TIMESTAMP = 93;
SQLTypes.BINARY = -2;
SQLTypes.VARBINARY = -3;
SQLTypes.LONGVARBINARY = -4;
SQLTypes.NULL = 0;
SQLTypes.OTHER = 1111;
SQLTypes.JAVA_OBJECT = 2000;
SQLTypes.DISTINCT = 2001;
SQLTypes.STRUCT = 2002;
SQLTypes.ARRAY = 2003;
SQLTypes.BLOB = 2004;
SQLTypes.CLOB = 2005;
SQLTypes.REF = 2006;
SQLTypes.DATALINK = 70;
SQLTypes.BOOLEAN = 16;
SQLTypes.ROWID = -8;
SQLTypes.NCHAR = -15;
SQLTypes.NVARCHAR = -9;
SQLTypes.LONGNVARCHAR = -16;
SQLTypes.NCLOB = 2011;
SQLTypes.BASE64 = 6464;
SQLTypes.SQLXML = 2009;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3FsdHlwZXMuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9vbnRpbWl6ZS13ZWItbmd4LyIsInNvdXJjZXMiOlsibGliL3V0aWwvc3FsdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxPQUFPLFFBQVE7SUFtUlosTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFZO1FBQ3hDLElBQUksS0FBYSxDQUFDO1FBQ2xCLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3RDLFFBQVEsSUFBSSxFQUFFO1lBQ1osS0FBSyxLQUFLO2dCQUNSLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO2dCQUNyQixNQUFNO1lBQ1IsS0FBSyxTQUFTO2dCQUNaLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUN6QixNQUFNO1lBQ1IsS0FBSyxVQUFVO2dCQUNiLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO2dCQUMxQixNQUFNO1lBQ1IsS0FBSyxTQUFTO2dCQUNaLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUN6QixNQUFNO1lBQ1IsS0FBSyxRQUFRO2dCQUNYLEtBQUssR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUN4QixNQUFNO1lBQ1IsS0FBSyxPQUFPO2dCQUNWLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUN2QixNQUFNO1lBQ1IsS0FBSyxNQUFNO2dCQUNULEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUN0QixNQUFNO1lBQ1IsS0FBSyxRQUFRO2dCQUNYLEtBQUssR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO2dCQUN4QixNQUFNO1lBQ1IsS0FBSyxTQUFTO2dCQUNaLEtBQUssR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO2dCQUN6QixNQUFNO1lBQ1IsS0FBSyxTQUFTO2dCQUNaLEtBQUssR0FB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R0FBRyxDQUFDLENBQUM7QUFPVCxlQUFNLEdBQUcsQ0FBQyxDQUFDO0FBT1gsZ0JBQU8sR0FBRyxDQUFDLENBQUM7QUFPWixnQkFBTyxHQUFHLENBQUMsQ0FBQztBQU9aLGFBQUksR0FBRyxDQUFDLENBQUM7QUFPVCxnQkFBTyxHQUFHLEVBQUUsQ0FBQztBQU9iLG9CQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFPakIsYUFBSSxHQUFHLEVBQUUsQ0FBQztBQU9WLGFBQUksR0FBRyxFQUFFLENBQUM7QUFPVixrQkFBUyxHQUFHLEVBQUUsQ0FBQztBQU9mLGVBQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQU9aLGtCQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFPZixzQkFBYSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBT25CLGFBQUksR0FBRyxDQUFDLENBQUM7QUFRVCxjQUFLLEdBQUcsSUFBSSxDQUFDO0FBUWIsb0JBQVcsR0FBRyxJQUFJLENBQUM7QUFRbkIsaUJBQVEsR0FBRyxJQUFJLENBQUM7QUFRaEIsZUFBTSxHQUFHLElBQUksQ0FBQztBQVFkLGNBQUssR0FBRyxJQUFJLENBQUM7QUFRYixhQUFJLEdBQUcsSUFBSSxDQUFDO0FBUVosYUFBSSxHQUFHLElBQUksQ0FBQztBQVFaLFlBQUcsR0FBRyxJQUFJLENBQUM7QUFRWCxpQkFBUSxHQUFHLEVBQUUsQ0FBQztBQVFkLGdCQUFPLEdBQUcsRUFBRSxDQUFDO0FBV2IsY0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBUVgsY0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBUVosaUJBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztBQVFkLHFCQUFZLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFRbkIsY0FBSyxHQUFHLElBQUksQ0FBQztBQUViLGVBQU0sR0FBRyxJQUFJLENBQUM7QUFRZCxlQUFNLEdBQUcsSUFBSSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFNRTFR5cGVzIHtcblxuICAvKipcbiAgICogPFA+VGhlIGNvbnN0YW50IGluIHRoZSBKYXZhIHByb2dyYW1taW5nIGxhbmd1YWdlLCBzb21ldGltZXMgcmVmZXJyZWRcbiAgICogdG8gYXMgYSB0eXBlIGNvZGUsIHRoYXQgaWRlbnRpZmllcyB0aGUgZ2VuZXJpYyBTUUwgdHlwZVxuICAgKiA8Y29kZT5CSVQ8L2NvZGU+LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBCSVQgPSAtNztcblxuICAvKipcbiAgICogPFA+VGhlIGNvbnN0YW50IGluIHRoZSBKYXZhIHByb2dyYW1taW5nIGxhbmd1YWdlLCBzb21ldGltZXMgcmVmZXJyZWRcbiAgICogdG8gYXMgYSB0eXBlIGNvZGUsIHRoYXQgaWRlbnRpZmllcyB0aGUgZ2VuZXJpYyBTUUwgdHlwZVxuICAgKiA8Y29kZT5USU5ZSU5UPC9jb2RlPi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgVElOWUlOVCA9IC02O1xuXG4gIC8qKlxuICAgKiA8UD5UaGUgY29uc3RhbnQgaW4gdGhlIEphdmEgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UsIHNvbWV0aW1lcyByZWZlcnJlZFxuICAgKiB0byBhcyBhIHR5cGUgY29kZSwgdGhhdCBpZGVudGlmaWVzIHRoZSBnZW5lcmljIFNRTCB0eXBlXG4gICAqIDxjb2RlPlNNQUxMSU5UPC9jb2RlPi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgU01BTExJTlQgPSA1O1xuXG4gIC8qKlxuICAgKiA8UD5UaGUgY29uc3RhbnQgaW4gdGhlIEphdmEgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UsIHNvbWV0aW1lcyByZWZlcnJlZFxuICAgKiB0byBhcyBhIHR5cGUgY29kZSwgdGhhdCBpZGVudGlmaWVzIHRoZSBnZW5lcmljIFNRTCB0eXBlXG4gICAqIDxjb2RlPklOVEVHRVI8L2NvZGU+LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBJTlRFR0VSID0gNDtcblxuICAvKipcbiAgICogPFA+VGhlIGNvbnN0YW50IGluIHRoZSBKYXZhIHByb2dyYW1taW5nIGxhbmd1YWdlLCBzb21ldGltZXMgcmVmZXJyZWRcbiAgICogdG8gYXMgYSB0eXBlIGNvZGUsIHRoYXQgaWRlbnRpZmllcyB0aGUgZ2VuZXJpYyBTUUwgdHlwZVxuICAgKiA8Y29kZT5CSUdJTlQ8L2NvZGU+LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBCSUdJTlQgPSAtNTtcblxuICAvKipcbiAgICogPFA+VGhlIGNvbnN0YW50IGluIHRoZSBKYXZhIHByb2dyYW1taW5nIGxhbmd1YWdlLCBzb21ldGltZXMgcmVmZXJyZWRcbiAgICogdG8gYXMgYSB0eXBlIGNvZGUsIHRoYXQgaWRlbnRpZmllcyB0aGUgZ2VuZXJpYyBTUUwgdHlwZVxuICAgKiA8Y29kZT5GTE9BVDwvY29kZT4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIEZMT0FUID0gNjtcblxuICAvKipcbiAgICogPFA+VGhlIGNvbnN0YW50IGluIHRoZSBKYXZhIHByb2dyYW1taW5nIGxhbmd1YWdlLCBzb21ldGltZXMgcmVmZXJyZWRcbiAgICogdG8gYXMgYSB0eXBlIGNvZGUsIHRoYXQgaWRlbnRpZmllcyB0aGUgZ2VuZXJpYyBTUUwgdHlwZVxuICAgKiA8Y29kZT5SRUFMPC9jb2RlPi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgUkVBTCA9IDc7XG5cbiAgLyoqXG4gICAqIDxQPlRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkXG4gICAqIHRvIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGVcbiAgICogPGNvZGU+RE9VQkxFPC9jb2RlPi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgRE9VQkxFID0gODtcblxuICAvKipcbiAgICogPFA+VGhlIGNvbnN0YW50IGluIHRoZSBKYXZhIHByb2dyYW1taW5nIGxhbmd1YWdlLCBzb21ldGltZXMgcmVmZXJyZWRcbiAgICogdG8gYXMgYSB0eXBlIGNvZGUsIHRoYXQgaWRlbnRpZmllcyB0aGUgZ2VuZXJpYyBTUUwgdHlwZVxuICAgKiA8Y29kZT5OVU1FUklDPC9jb2RlPi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgTlVNRVJJQyA9IDI7XG5cbiAgLyoqXG4gICAqIDxQPlRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkXG4gICAqIHRvIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGVcbiAgICogPGNvZGU+REVDSU1BTDwvY29kZT4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIERFQ0lNQUwgPSAzO1xuXG4gIC8qKlxuICAgKiA8UD5UaGUgY29uc3RhbnQgaW4gdGhlIEphdmEgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UsIHNvbWV0aW1lcyByZWZlcnJlZFxuICAgKiB0byBhcyBhIHR5cGUgY29kZSwgdGhhdCBpZGVudGlmaWVzIHRoZSBnZW5lcmljIFNRTCB0eXBlXG4gICAqIDxjb2RlPkNIQVI8L2NvZGU+LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBDSEFSID0gMTtcblxuICAvKipcbiAgICogPFA+VGhlIGNvbnN0YW50IGluIHRoZSBKYXZhIHByb2dyYW1taW5nIGxhbmd1YWdlLCBzb21ldGltZXMgcmVmZXJyZWRcbiAgICogdG8gYXMgYSB0eXBlIGNvZGUsIHRoYXQgaWRlbnRpZmllcyB0aGUgZ2VuZXJpYyBTUUwgdHlwZVxuICAgKiA8Y29kZT5WQVJDSEFSPC9jb2RlPi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgVkFSQ0hBUiA9IDEyO1xuXG4gIC8qKlxuICAgKiA8UD5UaGUgY29uc3RhbnQgaW4gdGhlIEphdmEgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UsIHNvbWV0aW1lcyByZWZlcnJlZFxuICAgKiB0byBhcyBhIHR5cGUgY29kZSwgdGhhdCBpZGVudGlmaWVzIHRoZSBnZW5lcmljIFNRTCB0eXBlXG4gICAqIDxjb2RlPkxPTkdWQVJDSEFSPC9jb2RlPi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgTE9OR1ZBUkNIQVIgPSAtMTtcblxuICAvKipcbiAgICogPFA+VGhlIGNvbnN0YW50IGluIHRoZSBKYXZhIHByb2dyYW1taW5nIGxhbmd1YWdlLCBzb21ldGltZXMgcmVmZXJyZWRcbiAgICogdG8gYXMgYSB0eXBlIGNvZGUsIHRoYXQgaWRlbnRpZmllcyB0aGUgZ2VuZXJpYyBTUUwgdHlwZVxuICAgKiA8Y29kZT5EQVRFPC9jb2RlPi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgREFURSA9IDkxO1xuXG4gIC8qKlxuICAgKiA8UD5UaGUgY29uc3RhbnQgaW4gdGhlIEphdmEgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UsIHNvbWV0aW1lcyByZWZlcnJlZFxuICAgKiB0byBhcyBhIHR5cGUgY29kZSwgdGhhdCBpZGVudGlmaWVzIHRoZSBnZW5lcmljIFNRTCB0eXBlXG4gICAqIDxjb2RlPlRJTUU8L2NvZGU+LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBUSU1FID0gOTI7XG5cbiAgLyoqXG4gICAqIDxQPlRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkXG4gICAqIHRvIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGVcbiAgICogPGNvZGU+VElNRVNUQU1QPC9jb2RlPi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgVElNRVNUQU1QID0gOTM7XG5cbiAgLyoqXG4gICAqIDxQPlRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkXG4gICAqIHRvIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGVcbiAgICogPGNvZGU+QklOQVJZPC9jb2RlPi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgQklOQVJZID0gLTI7XG5cbiAgLyoqXG4gICAqIDxQPlRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkXG4gICAqIHRvIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGVcbiAgICogPGNvZGU+VkFSQklOQVJZPC9jb2RlPi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgVkFSQklOQVJZID0gLTM7XG5cbiAgLyoqXG4gICAqIDxQPlRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkXG4gICAqIHRvIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGVcbiAgICogPGNvZGU+TE9OR1ZBUkJJTkFSWTwvY29kZT4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIExPTkdWQVJCSU5BUlkgPSAtNDtcblxuICAvKipcbiAgICogPFA+VGhlIGNvbnN0YW50IGluIHRoZSBKYXZhIHByb2dyYW1taW5nIGxhbmd1YWdlXG4gICAqIHRoYXQgaWRlbnRpZmllcyB0aGUgZ2VuZXJpYyBTUUwgdmFsdWVcbiAgICogPGNvZGU+TlVMTDwvY29kZT4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIE5VTEwgPSAwO1xuXG4gIC8qKlxuICAgKiBUaGUgY29uc3RhbnQgaW4gdGhlIEphdmEgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UgdGhhdCBpbmRpY2F0ZXNcbiAgICogdGhhdCB0aGUgU1FMIHR5cGUgaXMgZGF0YWJhc2Utc3BlY2lmaWMgYW5kXG4gICAqIGdldHMgbWFwcGVkIHRvIGEgSmF2YSBvYmplY3QgdGhhdCBjYW4gYmUgYWNjZXNzZWQgdmlhXG4gICAqIHRoZSBtZXRob2RzIDxjb2RlPmdldE9iamVjdDwvY29kZT4gYW5kIDxjb2RlPnNldE9iamVjdDwvY29kZT4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIE9USEVSID0gMTExMTtcblxuICAvKipcbiAgICogVGhlIGNvbnN0YW50IGluIHRoZSBKYXZhIHByb2dyYW1taW5nIGxhbmd1YWdlLCBzb21ldGltZXMgcmVmZXJyZWQgdG9cbiAgICogYXMgYSB0eXBlIGNvZGUsIHRoYXQgaWRlbnRpZmllcyB0aGUgZ2VuZXJpYyBTUUwgdHlwZVxuICAgKiA8Y29kZT5KQVZBX09CSkVDVDwvY29kZT4uXG4gICAqIEBzaW5jZSAxLjJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgSkFWQV9PQkpFQ1QgPSAyMDAwO1xuXG4gIC8qKlxuICAgKiBUaGUgY29uc3RhbnQgaW4gdGhlIEphdmEgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UsIHNvbWV0aW1lcyByZWZlcnJlZCB0b1xuICAgKiBhcyBhIHR5cGUgY29kZSwgdGhhdCBpZGVudGlmaWVzIHRoZSBnZW5lcmljIFNRTCB0eXBlXG4gICAqIDxjb2RlPkRJU1RJTkNUPC9jb2RlPi5cbiAgICogQHNpbmNlIDEuMlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBESVNUSU5DVCA9IDIwMDE7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkIHRvXG4gICAqIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGVcbiAgICogPGNvZGU+U1RSVUNUPC9jb2RlPi5cbiAgICogQHNpbmNlIDEuMlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBTVFJVQ1QgPSAyMDAyO1xuXG4gIC8qKlxuICAgKiBUaGUgY29uc3RhbnQgaW4gdGhlIEphdmEgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UsIHNvbWV0aW1lcyByZWZlcnJlZCB0b1xuICAgKiBhcyBhIHR5cGUgY29kZSwgdGhhdCBpZGVudGlmaWVzIHRoZSBnZW5lcmljIFNRTCB0eXBlXG4gICAqIDxjb2RlPkFSUkFZPC9jb2RlPi5cbiAgICogQHNpbmNlIDEuMlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBBUlJBWSA9IDIwMDM7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkIHRvXG4gICAqIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGVcbiAgICogPGNvZGU+QkxPQjwvY29kZT4uXG4gICAqIEBzaW5jZSAxLjJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgQkxPQiA9IDIwMDQ7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkIHRvXG4gICAqIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGVcbiAgICogPGNvZGU+Q0xPQjwvY29kZT4uXG4gICAqIEBzaW5jZSAxLjJcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgQ0xPQiA9IDIwMDU7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkIHRvXG4gICAqIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGVcbiAgICogPGNvZGU+UkVGPC9jb2RlPi5cbiAgICogQHNpbmNlIDEuMlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBSRUYgPSAyMDA2O1xuXG4gIC8qKlxuICAgKiBUaGUgY29uc3RhbnQgaW4gdGhlIEphdmEgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UsIHNvbXRpbWVzIHJlZmVycmVkIHRvXG4gICAqIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGUgPGNvZGU+REFUQUxJTks8L2NvZGU+LlxuICAgKlxuICAgKiBAc2luY2UgMS40XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIERBVEFMSU5LID0gNzA7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tdGltZXMgcmVmZXJyZWQgdG9cbiAgICogYXMgYSB0eXBlIGNvZGUsIHRoYXQgaWRlbnRpZmllcyB0aGUgZ2VuZXJpYyBTUUwgdHlwZSA8Y29kZT5CT09MRUFOPC9jb2RlPi5cbiAgICpcbiAgICogQHNpbmNlIDEuNFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBCT09MRUFOID0gMTY7XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBKREJDIDQuMCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBUaGUgY29uc3RhbnQgaW4gdGhlIEphdmEgcHJvZ3JhbW1pbmcgbGFuZ3VhZ2UsIHNvbWV0aW1lcyByZWZlcnJlZCB0b1xuICAgKiBhcyBhIHR5cGUgY29kZSwgdGhhdCBpZGVudGlmaWVzIHRoZSBnZW5lcmljIFNRTCB0eXBlIDxjb2RlPlJPV0lEPC9jb2RlPlxuICAgKlxuICAgKiBAc2luY2UgMS42XG4gICAqXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIFJPV0lEID0gLTg7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkIHRvXG4gICAqIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGUgPGNvZGU+TkNIQVI8L2NvZGU+XG4gICAqXG4gICAqIEBzaW5jZSAxLjZcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgTkNIQVIgPSAtMTU7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkIHRvXG4gICAqIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGUgPGNvZGU+TlZBUkNIQVI8L2NvZGU+LlxuICAgKlxuICAgKiBAc2luY2UgMS42XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIE5WQVJDSEFSID0gLTk7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkIHRvXG4gICAqIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGUgPGNvZGU+TE9OR05WQVJDSEFSPC9jb2RlPi5cbiAgICpcbiAgICogQHNpbmNlIDEuNlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBMT05HTlZBUkNIQVIgPSAtMTY7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkIHRvXG4gICAqIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGUgPGNvZGU+TkNMT0I8L2NvZGU+LlxuICAgKlxuICAgKiBAc2luY2UgMS42XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIE5DTE9CID0gMjAxMTtcblxuICBwdWJsaWMgc3RhdGljIEJBU0U2NCA9IDY0NjQ7XG5cbiAgLyoqXG4gICAqIFRoZSBjb25zdGFudCBpbiB0aGUgSmF2YSBwcm9ncmFtbWluZyBsYW5ndWFnZSwgc29tZXRpbWVzIHJlZmVycmVkIHRvXG4gICAqIGFzIGEgdHlwZSBjb2RlLCB0aGF0IGlkZW50aWZpZXMgdGhlIGdlbmVyaWMgU1FMIHR5cGUgPGNvZGU+WE1MPC9jb2RlPi5cbiAgICpcbiAgICogQHNpbmNlIDEuNlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBTUUxYTUwgPSAyMDA5O1xuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0U1FMVHlwZVZhbHVlKHR5cGU6IHN0cmluZyk6IG51bWJlciB7XG4gICAgbGV0IHZhbHVlOiBudW1iZXI7XG4gICAgdHlwZSA9IHR5cGUgPyB0eXBlLnRvVXBwZXJDYXNlKCkgOiAnJztcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ0JJVCc6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuQklUO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1RJTllJTlQnOlxuICAgICAgICB2YWx1ZSA9IFNRTFR5cGVzLlRJTllJTlQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnU01BTExJTlQnOlxuICAgICAgICB2YWx1ZSA9IFNRTFR5cGVzLlNNQUxMSU5UO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0lOVEVHRVInOlxuICAgICAgICB2YWx1ZSA9IFNRTFR5cGVzLklOVEVHRVI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnQklHSU5UJzpcbiAgICAgICAgdmFsdWUgPSBTUUxUeXBlcy5CSUdJTlQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnRkxPQVQnOlxuICAgICAgICB2YWx1ZSA9IFNRTFR5cGVzLkZMT0FUO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1JFQUwnOlxuICAgICAgICB2YWx1ZSA9IFNRTFR5cGVzLlJFQUw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnRE9VQkxFJzpcbiAgICAgICAgdmFsdWUgPSBTUUxUeXBlcy5ET1VCTEU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnTlVNRVJJQyc6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuTlVNRVJJQztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdERUNJTUFMJzpcbiAgICAgICAgdmFsdWUgPSBTUUxUeXBlcy5ERUNJTUFMO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0NIQVInOlxuICAgICAgICB2YWx1ZSA9IFNRTFR5cGVzLkNIQVI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnVkFSQ0hBUic6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuVkFSQ0hBUjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdMT05HVkFSQ0hBUic6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuTE9OR1ZBUkNIQVI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnREFURSc6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuREFURTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdUSU1FJzpcbiAgICAgICAgdmFsdWUgPSBTUUxUeXBlcy5USU1FO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1RJTUVTVEFNUCc6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuVElNRVNUQU1QO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0JJTkFSWSc6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuQklOQVJZO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1ZBUkJJTkFSWSc6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuVkFSQklOQVJZO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0xPTkdWQVJCSU5BUlknOlxuICAgICAgICB2YWx1ZSA9IFNRTFR5cGVzLkxPTkdWQVJCSU5BUlk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnTlVMTCc6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuTlVMTDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdPVEhFUic6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuT1RIRVI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnSkFWQV9PQkpFQ1QnOlxuICAgICAgICB2YWx1ZSA9IFNRTFR5cGVzLkpBVkFfT0JKRUNUO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0RJU1RJTkNUJzpcbiAgICAgICAgdmFsdWUgPSBTUUxUeXBlcy5ESVNUSU5DVDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdTVFJVQ1QnOlxuICAgICAgICB2YWx1ZSA9IFNRTFR5cGVzLlNUUlVDVDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdBUlJBWSc6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuQVJSQVk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnQkxPQic6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuQkxPQjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdDTE9CJzpcbiAgICAgICAgdmFsdWUgPSBTUUxUeXBlcy5DTE9CO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1JFRic6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuUkVGO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0RBVEFMSU5LJzpcbiAgICAgICAgdmFsdWUgPSBTUUxUeXBlcy5EQVRBTElOSztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdCT09MRUFOJzpcbiAgICAgICAgdmFsdWUgPSBTUUxUeXBlcy5CT09MRUFOO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1JPV0lEJzpcbiAgICAgICAgdmFsdWUgPSBTUUxUeXBlcy5ST1dJRDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdOQ0hBUic6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuTkNIQVI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnTlZBUkNIQVInOlxuICAgICAgICB2YWx1ZSA9IFNRTFR5cGVzLk5WQVJDSEFSO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0xPTkdOVkFSQ0hBUic6XG4gICAgICAgIHZhbHVlID0gU1FMVHlwZXMuTE9OR05WQVJDSEFSO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ05DTE9CJzpcbiAgICAgICAgdmFsdWUgPSBTUUxUeXBlcy5OQ0xPQjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdTUUxYTUwnOlxuICAgICAgICB2YWx1ZSA9IFNRTFR5cGVzLlNRTFhNTDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdCQVNFNjQnOlxuICAgICAgICB2YWx1ZSA9IFNRTFR5cGVzLkJBU0U2NDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YWx1ZSA9IFNRTFR5cGVzLk9USEVSO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXRTUUxUeXBlS2V5KHR5cGU6IG51bWJlcik6IHN0cmluZyB7XG4gICAgbGV0IHZhbHVlOiBzdHJpbmc7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlIFNRTFR5cGVzLkJJVDpcbiAgICAgICAgdmFsdWUgPSAnQklUJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNRTFR5cGVzLlRJTllJTlQ6XG4gICAgICAgIHZhbHVlID0gJ1RJTllJTlQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1FMVHlwZXMuU01BTExJTlQ6XG4gICAgICAgIHZhbHVlID0gJ1NNQUxMSU5UJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNRTFR5cGVzLklOVEVHRVI6XG4gICAgICAgIHZhbHVlID0gJ0lOVEVHRVInO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1FMVHlwZXMuQklHSU5UOlxuICAgICAgICB2YWx1ZSA9ICdCSUdJTlQnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1FMVHlwZXMuRkxPQVQ6XG4gICAgICAgIHZhbHVlID0gJ0ZMT0FUJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNRTFR5cGVzLlJFQUw6XG4gICAgICAgIHZhbHVlID0gJ1JFQUwnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1FMVHlwZXMuRE9VQkxFOlxuICAgICAgICB2YWx1ZSA9ICdET1VCTEUnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1FMVHlwZXMuTlVNRVJJQzpcbiAgICAgICAgdmFsdWUgPSAnTlVNRVJJQyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTUUxUeXBlcy5ERUNJTUFMOlxuICAgICAgICB2YWx1ZSA9ICdERUNJTUFMJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNRTFR5cGVzLkNIQVI6XG4gICAgICAgIHZhbHVlID0gJ0NIQVInO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1FMVHlwZXMuVkFSQ0hBUjpcbiAgICAgICAgdmFsdWUgPSAnVkFSQ0hBUic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTUUxUeXBlcy5MT05HVkFSQ0hBUjpcbiAgICAgICAgdmFsdWUgPSAnTE9OR1ZBUkNIQVInO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1FMVHlwZXMuREFURTpcbiAgICAgICAgdmFsdWUgPSAnREFURSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTUUxUeXBlcy5USU1FOlxuICAgICAgICB2YWx1ZSA9ICdUSU1FJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNRTFR5cGVzLlRJTUVTVEFNUDpcbiAgICAgICAgdmFsdWUgPSAnVElNRVNUQU1QJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNRTFR5cGVzLkJJTkFSWTpcbiAgICAgICAgdmFsdWUgPSAnQklOQVJZJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNRTFR5cGVzLlZBUkJJTkFSWTpcbiAgICAgICAgdmFsdWUgPSAnVkFSQklOQVJZJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNRTFR5cGVzLkxPTkdWQVJCSU5BUlk6XG4gICAgICAgIHZhbHVlID0gJ0xPTkdWQVJCSU5BUlknO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1FMVHlwZXMuTlVMTDpcbiAgICAgICAgdmFsdWUgPSAnTlVMTCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTUUxUeXBlcy5PVEhFUjpcbiAgICAgICAgdmFsdWUgPSAnT1RIRVInO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1FMVHlwZXMuSkFWQV9PQkpFQ1Q6XG4gICAgICAgIHZhbHVlID0gJ0pBVkFfT0JKRUNUJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNRTFR5cGVzLkRJU1RJTkNUOlxuICAgICAgICB2YWx1ZSA9ICdESVNUSU5DVCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTUUxUeXBlcy5TVFJVQ1Q6XG4gICAgICAgIHZhbHVlID0gJ1NUUlVDVCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTUUxUeXBlcy5BUlJBWTpcbiAgICAgICAgdmFsdWUgPSAnQVJSQVknO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1FMVHlwZXMuQkxPQjpcbiAgICAgICAgdmFsdWUgPSAnQkxPQic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTUUxUeXBlcy5DTE9COlxuICAgICAgICB2YWx1ZSA9ICdDTE9CJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNRTFR5cGVzLlJFRjpcbiAgICAgICAgdmFsdWUgPSAnUkVGJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNRTFR5cGVzLkRBVEFMSU5LOlxuICAgICAgICB2YWx1ZSA9ICdEQVRBTElOSyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTUUxUeXBlcy5CT09MRUFOOlxuICAgICAgICB2YWx1ZSA9ICdCT09MRUFOJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNRTFR5cGVzLlJPV0lEOlxuICAgICAgICB2YWx1ZSA9ICdST1dJRCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTUUxUeXBlcy5OQ0hBUjpcbiAgICAgICAgdmFsdWUgPSAnTkNIQVInO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1FMVHlwZXMuTlZBUkNIQVI6XG4gICAgICAgIHZhbHVlID0gJ05WQVJDSEFSJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNRTFR5cGVzLkxPTkdOVkFSQ0hBUjpcbiAgICAgICAgdmFsdWUgPSAnTE9OR05WQVJDSEFSJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFNRTFR5cGVzLk5DTE9COlxuICAgICAgICB2YWx1ZSA9ICdOQ0xPQic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTUUxUeXBlcy5TUUxYTUw6XG4gICAgICAgIHZhbHVlID0gJ1NRTFhNTCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBTUUxUeXBlcy5CQVNFNjQ6XG4gICAgICAgIHZhbHVlID0gJ0JBU0U2NCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFsdWUgPSAnT1RIRVInO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBwYXJzZVVzaW5nU1FMVHlwZShhcmc6IGFueSwgdHlwZTogc3RyaW5nKTogYW55IHtcbiAgICBsZXQgdmFsdWUgPSBhcmc7XG4gICAgdHlwZSA9IHR5cGUgPyB0eXBlLnRvVXBwZXJDYXNlKCkgOiAnJztcbiAgICB0cnkge1xuICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgJ1RJTllJTlQnOlxuICAgICAgICBjYXNlICdTTUFMTElOVCc6XG4gICAgICAgIGNhc2UgJ0lOVEVHRVInOlxuICAgICAgICBjYXNlICdCSUdJTlQnOlxuICAgICAgICAgIHZhbHVlID0gTnVtYmVyKGFyZyk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0ZMT0FUJzpcbiAgICAgICAgY2FzZSAnUkVBTCc6XG4gICAgICAgIGNhc2UgJ0RPVUJMRSc6XG4gICAgICAgIGNhc2UgJ05VTUVSSUMnOlxuICAgICAgICBjYXNlICdERUNJTUFMJzpcbiAgICAgICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQoYXJnKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1NRTFR5cGVzLnBhcnNlVXNpbmdTUUxUeXBlIGVycm9yJyk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgaXNOdW1lcmljU1FMVHlwZShhcmc6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBbXG4gICAgICBTUUxUeXBlcy5USU5ZSU5ULFxuICAgICAgU1FMVHlwZXMuU01BTExJTlQsXG4gICAgICBTUUxUeXBlcy5JTlRFR0VSLFxuICAgICAgU1FMVHlwZXMuQklHSU5ULFxuICAgICAgU1FMVHlwZXMuRkxPQVQsXG4gICAgICBTUUxUeXBlcy5SRUFMLFxuICAgICAgU1FMVHlwZXMuRE9VQkxFLFxuICAgICAgU1FMVHlwZXMuTlVNRVJJQyxcbiAgICAgIFNRTFR5cGVzLkRFQ0lNQUxcbiAgICBdLmluZGV4T2YoYXJnKSAhPT0gLTE7XG4gIH1cblxufVxuIl19