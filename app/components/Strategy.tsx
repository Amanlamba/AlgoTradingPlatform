"use client";

import { useState } from "react";
import Select, { MultiValue } from "react-select";

interface OptionType {
    value: string;
    label: string;
}

interface StrategyProps {
    name: string;
    dropdownOptions: OptionType[];
    onToggle: (status: string, id: string) => void;
    id: string; // Unique id for each Strategy component
    onAdd: (id: string) => void; // Callback for adding the strategy
    onRemove: (id: string) => void; // Callback for removing the strategy
}

const Strategy = ({ name, dropdownOptions, onToggle, id, onAdd, onRemove }: StrategyProps) => {
    const [status, setStatus] = useState("off");
    const [selectedOptions, setSelectedOptions] = useState<MultiValue<OptionType>>([]);
    const [error, setError] = useState<string | null>(null);

    const handleToggleChange = (newStatus: string) => {
        if (newStatus === "on" && selectedOptions.length === 0) {
            setError("Please select at least one option.");
            return;
        }
        setStatus(newStatus);
        onToggle(newStatus, id); // Update the parent state via callback
        setError(null); // Clear error if status is valid
    };

    const handleDropdownChange = (selected: MultiValue<OptionType>) => {
        setSelectedOptions(selected);
        if (status === "on" && selected.length === 0) {
            setError("Please select at least one option.");
            onRemove(id); // Notify parent to remove this strategy if no options are selected
        } else {
            setError(null); // Clear error if options are selected
        }
    };

    const handleAddStrategy = () => {
        if (status === "on" && selectedOptions.length > 0) {
            onAdd(id); // Notify parent to add this strategy
        } else {
            setError("Please select at least one option before adding.");
        }
    };

    return (
        <div className="p-4 bg-white shadow rounded-lg border border-gray-200 mb-4">
            <h1 className="bg-teal-600 text-white text-xl font-semibold p-4 rounded-t-lg">
                {name}
            </h1>

            {/* Radio Button for On/Off Status */}
            <div className="flex flex-col md:flex-row justify-center items-center mt-4 space-y-2 md:space-y-0 md:space-x-4">
                <div className="flex items-center">
                    <input
                        type="radio"
                        id={`on-${id}`}  // Unique id for the "on" radio button
                        name={`status-${id}`}  // Unique name for the radio button group
                        value="on"
                        checked={status === "on"}
                        onChange={() => handleToggleChange("on")}
                        className="hidden"
                    />
                    <label
                        htmlFor={`on-${id}`}
                        className="cursor-pointer flex items-center text-gray-700"
                    >
                        <span className="mr-2 text-sm">On</span>
                        <span
                            className={`w-6 h-6 rounded-full border-2 transition-colors duration-300 ${status === "on" ? "border-teal-600 bg-teal-600" : "border-gray-300"
                                }`}
                        ></span>
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        type="radio"
                        id={`off-${id}`}  // Unique id for the "off" radio button
                        name={`status-${id}`}  // Unique name for the radio button group
                        value="off"
                        checked={status === "off"}
                        onChange={() => handleToggleChange("off")}
                        className="hidden"
                    />
                    <label
                        htmlFor={`off-${id}`}
                        className="cursor-pointer flex items-center text-gray-700"
                    >
                        <span className="mr-2 text-sm">Off</span>
                        <span
                            className={`w-6 h-6 rounded-full border-2 transition-colors duration-300 ${status === "off" ? "border-teal-600 bg-teal-600" : "border-gray-300"
                                }`}
                        ></span>
                    </label>
                </div>
            </div>

            {/* Dropdown with Search and Multi-Select */}
            <div className="mt-4">
                <Select
                    isMulti
                    name="options"
                    options={dropdownOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleDropdownChange}
                    value={selectedOptions}
                    placeholder="Select options..."
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            borderColor: "#d1d5db", // Tailwind's gray-300
                            boxShadow: "none",
                            "&:hover": { borderColor: "#94a3b8" }, // Tailwind's gray-400
                        }),
                        multiValue: (provided) => ({
                            ...provided,
                            backgroundColor: "#26A69A", // Teal color for selected options
                        }),
                        multiValueLabel: (provided) => ({
                            ...provided,
                            color: "#ffffff", // White text on selected options
                        }),
                        multiValueRemove: (provided) => ({
                            ...provided,
                            color: "#ffffff",
                            "&:hover": {
                                backgroundColor: "#1d8e78", // Darker teal on hover
                            },
                        }),
                    }}
                />
            </div>

            {/* Error message */}
            {error && <p className="mt-4 text-red-500">{error}</p>}

            {/* Add Strategy Button */}
            <button
                onClick={handleAddStrategy}
                className={`mt-4 w-full py-2 px-4 rounded transition ${status === 'off'
                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed' // Disabled state
                    : 'bg-teal-600 text-white hover:bg-teal-700' // Enabled state
                    }`}
                disabled={status === 'off'}
            >
                Add Strategy to Active List
            </button>



        </div>
    );
};

export default Strategy;
