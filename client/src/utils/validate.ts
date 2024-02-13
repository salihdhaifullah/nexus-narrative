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

    code(length: number, errorMessage: string) {
        return this
            .min(length, errorMessage)
            .max(length, errorMessage)
            .regex(/^[0-9]+$/, errorMessage);
    }

    regex(regex: RegExp, errorMessage: string): ObjectValidator {
        this.rules.push({
            ruleFunction: (value) => this.isFalsy(value) || (typeof value === "string" && regex.test(value)),
            errorMessage
        });
        return this;
    }

    email(errorMessage: string): ObjectValidator {
        return this
            .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, errorMessage)
            .min(3, errorMessage)
            .max(320, errorMessage);
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

    type: T = null as T;

    property<K extends keyof T>(name: K, call: (v: ObjectValidator) => void): Schema<T> {
        this.validators[name] = new ObjectValidator();
        call(this.validators[name]);
        return this;
    }

    validate(data: T): { errors: Record<keyof T, string | null>, isError: boolean } {
        const errors: Record<keyof T, string | null> = {} as Record<keyof T, string | null>;
        let isError = false;
        for (const key in this.validators) {
            if (Object.prototype.hasOwnProperty.call(this.validators, key)) {
                const val = this.validators[key].validate(data[key] as unknown as Value);
                errors[key] = val;
                if (val) isError = true;
            }
        }

        return { errors, isError };
    }
}

