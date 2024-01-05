type Value = string | number | null | undefined;
type RuleFunction = (value: Value) => boolean;

class ObjectValidator {
    private rules: { ruleFunction: RuleFunction, errorMessage: string }[] = [];

    private isFalsy(value: Value) {
        return value === undefined || value === null;
    }

    validate(value: Value): string | null {
        for (const { ruleFunction, errorMessage } of this.rules) {
            const isValid = ruleFunction(value);
            if (!isValid) return errorMessage;
        }

        return null;
    }

    min(minValue: number, errorMessage: string): ObjectValidator {
        this.rules.push({
            ruleFunction: (value) => {
                if (this.isFalsy(value)) return true;
                if (typeof value === "number") return value >= minValue
                else return value!.length >= minValue
            },
            errorMessage
        });
        return this;
    }

    max(maxValue: number, errorMessage: string): ObjectValidator {
        this.rules.push({
            ruleFunction: (value) => {
                if (this.isFalsy(value)) return true;
                if (typeof value === "number") return value <= maxValue
                else return value!.length <= maxValue
            },
            errorMessage
        });
        return this;
    }

    regex(regex: RegExp, errorMessage: string): ObjectValidator {
        this.rules.push({
            ruleFunction: (value) => this.isFalsy(value) || (typeof value === "string" && regex.test(value)),
            errorMessage
        });
        return this;
    }

    email(errorMessage: string): ObjectValidator {
        return this.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, errorMessage);
    }

    number(errorMessage: string): ObjectValidator {
        this.rules.push({
            ruleFunction: (value) => this.isFalsy(value) || typeof value === 'number',
            errorMessage
        });
        return this;
    }

    required(errorMessage: string): ObjectValidator {
        this.rules.push({
            ruleFunction: (value) => !this.isFalsy(value),
            errorMessage
        });
        return this;
    }
}

export default class Schema<T> {
    private validators: Record<keyof T, ObjectValidator> = {} as Record<keyof T, ObjectValidator>;

    property<K extends keyof T>(name: K, call: (v: ObjectValidator) => void): Schema<T> {
        this.validators[name] = new ObjectValidator();
        call(this.validators[name]);
        return this;
    }

    validate(data: T): Record<keyof T, string | null> {
        const errors: Record<keyof T, string | null> = {} as Record<keyof T, string | null>;

        for (const key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                errors[key] = this.validators[key].validate(data[key] as unknown as Value);
            }
        }

        return errors;
    }
}

