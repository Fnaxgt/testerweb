import React, {useEffect} from 'react';

class InputComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || '', // Set default value
            error: '',
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({ value: this.props.value }, () => {
                this.validate(this.props.value);
            });
        }
    }

    handleChange = (event) => {
        const { value } = event.target;
        this.setState({ value }, () => {
            this.validate(value);
        });
    };

    validate = (value) => {
        const { required, min } = this.props;
        let error = '';

        if (required && !value.trim()) {
            error = 'This field is required.';
        } else if (min && value.length < min) {
            error = `Minimum length should be ${min} characters.`;
        }

        this.setState({ error });
    };

    render() {
        const { type, placeholder } = this.props;
        const { value, error } = this.state;

        return (
            <div>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={this.handleChange}
                />
                <div className={'input-error'}>
                    {error && <span style={{ color: 'red' }}>{error}</span>}
                </div>
            </div>
        );
    }
}

export default InputComponent;
