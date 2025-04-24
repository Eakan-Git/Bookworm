import React, { useState } from "react";

interface TabsProps {
    name: string;
    content: React.ReactNode;
}

interface TabsContainerProps {
    header?: React.ReactNode;
    tabs: TabsProps[];
}

export default function TabsContainer({ header, tabs }: TabsContainerProps) {
    const [tabGroupId] = React.useState(`tab_group_${Math.random().toString(36).substr(2, 9)}`);
    const [activeTab, setActiveTab] = useState(0);

    const handleTabButtonClick = (tabName: string, tabIndex: number) => {
        const radioInput = document.getElementById(tabName) as HTMLInputElement;
        if (radioInput) {
            radioInput.checked = true;
            setActiveTab(tabIndex);
        }
    };

    return (
        <div className="w-11/12 mx-auto my-4">
            <div className="flex flex-col">
                <div>{header && header}</div>
                <div className="flex justify-center mb-4 gap-2">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            className={`btn rounded-sm ${activeTab === index ? 'btn-primary' : 'btn-ghost'}`}
                            onClick={() => handleTabButtonClick(tab.name, index)}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>
                <div className="py-8 border border-base-content/20">
                    <div className="tabs tabs-box p-0 m-0 shadow-none bg-transparent border-none">
                        {tabs.map((tab, index) => (
                            <React.Fragment key={index}>
                                <input
                                    id={tab.name}
                                    type="radio"
                                    name={tabGroupId}
                                    className="tab"
                                    aria-label={tab.name}
                                    defaultChecked={index === 0}
                                    hidden
                                />
                                <div className="tab-content">
                                    {tab.content}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}