// src/App.js
import React, { useState } from 'react';
import { createRule, combineRules, evaluateRule, modifyRule } from './api';
import './App.css';
function App() {
    const [ruleString, setRuleString] = useState('');
    const [combinedRuleIds, setCombinedRuleIds] = useState([]);
    const [evaluationData, setEvaluationData] = useState({});
    const [modifyRuleId, setModifyRuleId] = useState('');
    const [newRuleString, setNewRuleString] = useState('');
    const [response, setResponse] = useState(null);

    const handleCreateRule = async () => {
        try {
            const res = await createRule(ruleString);
            console.log("get create rule",res.data);
            //res.send(res.data);
            setResponse(res.data);
        } catch (error) {
            console.error('Error creating rule:', error);
        }
    };

    const handleCombineRules = async () => {
        try {
            const res = await combineRules(combinedRuleIds);
            setResponse(res.data);
        } catch (error) {
            console.error('Error combining rules:', error);
        }
    };

    const handleEvaluateRule = async () => {
        try {
            const res = await evaluateRule(modifyRuleId, evaluationData);
            setResponse(res.data);
        } catch (error) {
            console.error('Error evaluating rule:', error);
        }
    };

    const handleModifyRule = async () => {
        try {
            const res = await modifyRule(modifyRuleId, newRuleString);
            setResponse(res.data);
        } catch (error) {
            console.error('Error modifying rule:', error);
        }
    };

    return (
        <div>
            <h1>Rule Engine</h1>

            <div>
                <h2>Create Rule</h2>
                <input
                    type="text"
                    value={ruleString}
                    onChange={(e) => setRuleString(e.target.value)}
                    placeholder="Enter rule string"
                />
                <button onClick={handleCreateRule}>Create Rule</button>
            </div>

            <div>
                <h2>Combine Rules</h2>
                <input
                    type="text"
                    value={combinedRuleIds.join(',')}
                    onChange={(e) => setCombinedRuleIds(e.target.value.split(','))}
                    placeholder="Enter rule IDs to combine (comma separated)"
                />
                <button onClick={handleCombineRules}>Combine Rules</button>
            </div>

            <div>
                <h2>Evaluate Rule</h2>
                <input
                    type="text"
                    value={modifyRuleId}
                    onChange={(e) => setModifyRuleId(e.target.value)}
                    placeholder="Enter rule ID"
                />
                <input
                    type="text"
                    value={JSON.stringify(evaluationData)}
                    onChange={(e) => setEvaluationData(JSON.parse(e.target.value))}
                    placeholder='Enter data as JSON (e.g., {"age": 30})'
                />
                <button onClick={handleEvaluateRule}>Evaluate Rule</button>
            </div>

            <div>
                <h2>Modify Rule</h2>
                <input
                    type="text"
                    value={modifyRuleId}
                    onChange={(e) => setModifyRuleId(e.target.value)}
                    placeholder="Enter rule ID to modify"
                />
                <input
                    type="text"
                    value={newRuleString}
                    onChange={(e) => setNewRuleString(e.target.value)}
                    placeholder="Enter new rule string"
                />
                <button onClick={handleModifyRule}>Modify Rule</button>
            </div>

            <div>
                <h2>Response</h2>
                <pre>{response && JSON.stringify(response, null, 2)}</pre>
            </div>
        </div>
    );
}

export default App;
