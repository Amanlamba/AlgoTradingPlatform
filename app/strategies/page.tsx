"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Strategy from "../components/Strategy";
import Modal from "../components/Modal";

interface OptionType {
    value: string;
    label: string;
}

export default function StrategyPage() {
    const [activeStrategies, setActiveStrategies] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const dropdownOptions: OptionType[] = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
        { value: "option3", label: "Option 3" },
        { value: "option4", label: "Option 4" },
    ];

    const handleToggleChange = (strategyName: string, newStatus: string) => {
        if (newStatus === "off")
            setActiveStrategies((prev) => {
                return prev.filter((name) => name !== strategyName);
            });
    };

    const handleAddStrategy = (strategyId: string) => {
        // Here we should use the strategyId to get the strategy name or other details if needed
        const strategyName = `Strategy ${strategyId.slice(-1)}`; // Extract name based on id
        setActiveStrategies((prev) => [...prev, strategyName]);
    };

    const handleRemoveStrategy = (strategyId: string) => {
        const strategyName = `Strategy ${strategyId.slice(-1)}`;
        setActiveStrategies((prev) => prev.filter((name) => name !== strategyName));
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const navigateToDashboard = () => {
        router.push("/dashboard");
    };
    return (
        <div className="flex flex-col md:flex-row">
            {/* Left half: Strategy components */}
            <div className="w-full md:w-1/2 p-4 space-y-4">
                <Strategy
                    id="strategy1"
                    name="Strategy 1"
                    dropdownOptions={dropdownOptions}
                    onToggle={(newStatus, id) => handleToggleChange("Strategy 1", newStatus)}
                    onAdd={handleAddStrategy}
                    onRemove={handleRemoveStrategy}
                />
                <Strategy
                    id="strategy2"
                    name="Strategy 2"
                    dropdownOptions={dropdownOptions}
                    onToggle={(newStatus, id) => handleToggleChange("Strategy 2", newStatus)}
                    onAdd={handleAddStrategy}
                    onRemove={handleRemoveStrategy}
                />
                <Strategy
                    id="strategy3"
                    name="Strategy 3"
                    dropdownOptions={dropdownOptions}
                    onToggle={(newStatus, id) => handleToggleChange("Strategy 3", newStatus)}
                    onAdd={handleAddStrategy}
                    onRemove={handleRemoveStrategy}
                />
            </div>

            {/* Right half: Consolidated list of active strategies */}
            <div className="w-full md:w-1/2 p-4 bg-gray-100">
                <h2 className="text-xl font-semibold mb-4">Active Strategies</h2>
                <ul className="space-y-2">
                    {activeStrategies.length > 0 ? (
                        activeStrategies.map((strategyName) => (
                            <li key={strategyName} className="bg-white p-2 rounded shadow-sm border border-gray-300">
                                {strategyName}
                            </li>
                        ))
                    ) : (
                        <p>No active strategies</p>
                    )}
                </ul>
                {activeStrategies.length > 0 && (
                    <button
                        onClick={openModal}
                        className="mt-4 w-full py-2 px-4 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                    >
                        Review Terms & Conditions
                    </button>
                )}
            </div>

            {/* Modal */}
            <Modal heading="Terms & Conditions" isOpen={isModalOpen} onClose={closeModal}>
                <p className="mb-4">
                    {/* Replace with your terms and conditions text */}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                    convallis justo non quam auctor, non tempor lorem venenatis.
                </p>
                <button
                    onClick={navigateToDashboard}
                    className="w-full py-2 px-4 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                >
                    Confirm and Proceed
                </button>
            </Modal>



        </div>
    );
}
