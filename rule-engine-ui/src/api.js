import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const createRule = (ruleString) =>{ return axios.post(`${API_URL}/create_rule`, { rule_string: ruleString })};

   // console.log("rulestring", ruleString);
export const combineRules = (rules) => axios.post(`${API_URL}/combine_rules`, { rules });
export const evaluateRule = (rule, data) => axios.post(`${API_URL}/evaluate_rule`, { rule, data });
export const modifyRule = (ruleIndex, newRule) => axios.post(`${API_URL}/modify_rule`, { ruleIndex, newRule });
