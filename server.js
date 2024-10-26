const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const mongoose = require("mongoose")
const Rule =require('./rule')
const cors = require("cors");
const connectDb= async()=>{
    await mongoose.connect('mongodb+srv://User100:q65XPkSuN2KcB2nN@rulee.jz9la.mongodb.net/CreateRules')
    console.log(`db is connected with ${mongoose.connection.host}`);
}
//console.log("Attempting to connect to the database...");
connectDb(); 
//console.log("Database connection initiated.");

app.use(cors({
    origin: "http://localhost:5000" 
}));
app.use(bodyParser.json());
const validAttributes = ['age', 'department', 'salary', 'experience'];
const userDefinedFunctions = {
    isHighEarner: (salary) => salary > 100000,
    isYoung: (age) => age < 25
};

function isValidAttribute(attribute) {
    return validAttributes.includes(attribute) || userDefinedFunctions[attribute];
}

function createAST(ruleString) {
    //console.log("hereee",ruleString);
    const tokens = ruleString.split(' ').filter(t => t.trim());
    console.log("token",tokens, tokens.length);
    if (tokens.length < 3) throw new Error('Invalid rule format.');
    const [left, operator, right] = tokens;
    console.log(left);
     if (!isValidAttribute(left)) throw new Error(`Invalid attribute: ${left}`);
    
    return {
        type: operator === 'AND' || operator === 'OR' ? 'operator' : 'operand',
        value: operator,
        left: { type: 'operand', value: left },
        right: { type: 'operand', value: right }
    };
}

const createRule = async (req, res) => {
    try {
        const { ruleString} = req.body;
         //console.log("ruleString",ruleString);
         const ast = createAST(ruleString);
        const rule = new Rule({ ruleString, ast: JSON.stringify(ast)});
        await rule.save();
        res.status(201).json({ message: 'Rule created', rule });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const combineRules = async (req, res) => {
    try {
        const { _id } = req.body;
        console.log("combine str", _id);
        if (!Array.isArray(_id) || _id.length < 2) {
            throw new Error("Need at least 2 rules to combine.");
        }
        const rules = await Rule.find({ _id: { $in: _id } });
        console.log("Retrieved rules:", JSON.stringify(rules, null, 2));

        if (rules.length < 2) throw new Error("Need at least 2 rules to combine.");

        let combinedAST = rules.reduce((acc, rule) => ({
            type: 'operator',
            value: 'AND',
            left: acc,
            right: rule.ast
        }));
        console.log("Combined AST structure:", JSON.stringify(combinedAST, null, 2));
        const combinedRule = new Rule({
            ruleString: rules.map(r => r.ruleString).join(' AND '),
            ast: JSON.stringify(combinedAST),
            combinedIds: _id
        });
        console.log("Combined rule object:", JSON.stringify(combinedRule, null, 2));
        await combinedRule.save();

        res.json({ message: 'Rules combined', combinedRule });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const evaluateRule = async (req, res) => {
    const { ruleId, data } = req.body;
    const rule = await Rule.findById(ruleId);
    if (!rule) return res.status(404).json({ error: 'Rule not found' });
    if (!rule.ast) return res.status(400).json({ error: 'Rule AST not defined' });
    
    console.log("Retrieved Rule:", rule);
    console.log("Rule AST:", rule.ast);
    const evaluateAST = (ast) => {
        if (!ast) {
            throw new Error("AST node is undefined");
        }
        if (ast.type === 'operand') {
            const [attribute, operator, value] = ast.value.split(' ');
            if (userDefinedFunctions[attribute]) return userDefinedFunctions[attribute](data[attribute]);
            return eval(`${data[attribute]} ${operator} ${value}`);
        }
        return ast.value === 'AND' ? evaluateAST(ast.left) && evaluateAST(ast.right) : evaluateAST(ast.left) || evaluateAST(ast.right);
    };
    
    try {
        const result = evaluateAST(rule.ast);
        console.log("result", result)
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const modifyRule = async (req, res) => {
    const { ruleId, newRuleString } = req.body;
    console.log("Extracted ruleId:", ruleId); 
    
    if (!ruleId) {
        return res.status(400).json({ error: 'ruleId is required' });
    }

    try {
        const ast = createAST(newRuleString);
        const astString = JSON.stringify(ast); 
        console.log("Attempting to modify rule with ID:", ruleId);
        const rule = await Rule.findByIdAndUpdate(ruleId, { ruleString: newRuleString, ast: astString }, { new: true });
        console.log("hreee is new rule",rule);
        res.json({ message: 'Rule modified', rule });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

app.post('/create_rule', createRule);
app.post('/combine_rules', combineRules);
app.post('/evaluate_rule', evaluateRule);
app.post('/modify_rule', modifyRule);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
