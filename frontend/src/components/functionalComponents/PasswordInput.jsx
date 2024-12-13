import { useState } from "react";
import { TbEyeClosed, TbEye } from "react-icons/tb";
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

const PasswordInput = ({ name, placeholder, onValueChange }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleInputChange = (event) => {
        onValueChange(event.target.value);
    };

    return (
        <div className="relative">
            <input
                placeholder={placeholder}
                type={showPassword ? "text" : "password"}
                name={name}
                className="flex w-full h-10 px-3 py-2 text-sm bg-transparent border rounded-md border-primary placeholder:text-gray-600"
                required
                onChange={handleInputChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => {
                    setIsInputFocused(false);
                    setShowPassword(false);
                }}
            />
            {isInputFocused && (
                <button
                    type="button"
                    className="absolute right-2 top-2"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setShowPassword(!showPassword);
                    }}
                >
                    {showPassword ? (
                        <TbEyeClosed className="text-2xl text-black hide" />
                    ) : (
                        <TbEye className="text-2xl text-black show" />
                    )}
                </button>
            )}
            <Tooltip
                anchorSelect=".show"
                place="top"
                style={{
                    backgroundColor: "rgba(0, 119, 182, 1)",
                    color: "rgb(255, 255, 255)",
                    borderColor: "rgba(0, 119, 182, 1)",
                    borderWidth: "2px",
                    fontWeight: "700",
                }}
            >
                Show Password
            </Tooltip>
            <Tooltip
                anchorSelect=".hide"
                place="top"
                style={{
                    backgroundColor: "rgba(0, 119, 182, 1)",
                    color: "rgb(255, 255, 255)",
                    borderColor: "rgba(0, 119, 182, 1)",
                    borderWidth: "2px",
                    fontWeight: "700",
                }}
            >
                Hide Password
            </Tooltip>
        </div>
    );
};

PasswordInput.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    onValueChange: PropTypes.func.isRequired,
};

export default PasswordInput;
