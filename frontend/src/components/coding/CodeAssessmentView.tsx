import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import {
  Code,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Terminal,
  FileCode,
  Check
} from 'lucide-react';

interface TestCaseResult {
  name: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTimeMs: number;
}

interface CodeExecutionResponse {
  status: string;
  stdout: string;
  stderr: string;
  totalExecutionTimeMs: number;
  totalTestCases: number;
  passedTestCases: number;
  results: TestCaseResult[];
  message: string;
}

interface CodingProblem {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  starterCode: Record<string, string>;
  testCases: Array<{
    name: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
  }>;
}

export const CodeAssessmentView: React.FC = () => {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [currentProblem, setCurrentProblem] = useState<CodingProblem | null>(null);
  const [language, setLanguage] = useState<'JAVA' | 'PYTHON' | 'JAVASCRIPT'>('JAVA');
  const [code, setCode] = useState<string>('');
  const [running, setRunning] = useState<boolean>(false);
  const [result, setResult] = useState<CodeExecutionResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'testcases' | 'console'>('testcases');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    apiRequest<CodingProblem[]>('/coding/problems')
      .then((data) => {
        setProblems(data);
        if (data.length > 0) {
          const first = data[0];
          setCurrentProblem(first);
          setCode(first.starterCode[language] || '');
        }
      })
      .catch((err) => console.error('Failed to load coding problems:', err));
  }, []);

  const handleSelectProblem = (p: CodingProblem) => {
    setCurrentProblem(p);
    setCode(p.starterCode[language] || '');
    setResult(null);
  };

  const handleSelectLanguage = (lang: 'JAVA' | 'PYTHON' | 'JAVASCRIPT') => {
    setLanguage(lang);
    if (currentProblem) {
      setCode(currentProblem.starterCode[lang] || '');
    }
  };

  const handleResetCode = () => {
    if (currentProblem && confirm('Reset code to starter template?')) {
      setCode(currentProblem.starterCode[language] || '');
      setResult(null);
    }
  };

  const handleRunCode = async () => {
    if (!currentProblem) return;
    setRunning(true);
    setResult(null);
    try {
      const res = await apiRequest<CodeExecutionResponse>('/coding/execute', {
        method: 'POST',
        body: JSON.stringify({
          language,
          code,
          problemId: currentProblem.id,
        }),
      });
      setResult(res);
      setActiveTab('testcases');
    } catch (err: any) {
      alert(`Execution failed: ${err.message}`);
    } finally {
      setRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-white text-slate-800 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Top Header Bar */}
      <div className="h-14 bg-slate-50 border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
            <Code className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>Technical Coding Assessment Module</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono font-semibold">
                COMPILER RUNNER
              </span>
            </div>
          </div>
        </div>

        {/* Problem Selector & Controls */}
        <div className="flex items-center space-x-3">
          <select
            value={currentProblem?.id || ''}
            onChange={(e) => {
              const p = problems.find((item) => item.id === e.target.value);
              if (p) handleSelectProblem(p);
            }}
            className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-medium shadow-2xs"
          >
            {problems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.difficulty})
              </option>
            ))}
          </select>

          {/* Language Selector */}
          <div className="flex bg-slate-200/70 border border-slate-300/80 rounded-xl p-0.5 text-xs">
            {(['JAVA', 'PYTHON', 'JAVASCRIPT'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleSelectLanguage(lang)}
                className={`px-3 py-1 rounded-lg font-mono font-semibold transition ${
                  language === lang
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Reset Template */}
          <button
            onClick={handleResetCode}
            title="Reset Template"
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 transition shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={running}
            className="flex items-center space-x-2 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm"
          >
            <Play className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
            <span>{running ? 'Running...' : 'Run & Test'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-0">
        {/* Left Problem Description Pane (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-200 p-6 overflow-y-auto bg-[#FAFAF9] space-y-6 [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent]">
          {currentProblem ? (
            <>
              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                      currentProblem.difficulty === 'BEGINNER'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {currentProblem.difficulty}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {currentProblem.category}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-2">
                  {currentProblem.title}
                </h2>
              </div>

              {/* Description */}
              <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                <p>{currentProblem.description}</p>
              </div>

              {/* Input/Output Format */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Input Format
                  </h4>
                  <p className="text-xs text-slate-800 mt-1 font-mono bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    {currentProblem.inputFormat}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Output Format
                  </h4>
                  <p className="text-xs text-slate-800 mt-1 font-mono bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    {currentProblem.outputFormat}
                  </p>
                </div>
              </div>

              {/* Test Cases Overview */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Reference Test Cases
                </h4>
                <div className="space-y-2">
                  {currentProblem.testCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-mono space-y-1 shadow-2xs"
                    >
                      <div className="flex justify-between text-slate-600">
                        <span className="font-semibold text-slate-800">{tc.name}</span>
                        {tc.isHidden && (
                          <span className="text-[10px] text-amber-600 font-sans font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                            Hidden Test
                          </span>
                        )}
                      </div>
                      <div className="text-slate-600">
                        <span className="text-slate-400">Input:</span> {tc.input}
                      </div>
                      <div className="text-slate-600">
                        <span className="text-slate-400">Expected:</span>{' '}
                        <span className="text-emerald-700 font-bold">{tc.expectedOutput}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-400 py-12">Loading problem specifications...</div>
          )}
        </div>

        {/* Right Code Editor & Console Pane (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-full bg-white overflow-hidden">
          {/* Editor Sub-header */}
          <div className="h-10 bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between text-xs text-slate-600 shrink-0">
            <div className="flex items-center space-x-2">
              <FileCode className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-mono text-slate-800 font-medium">
                Solution.{language === 'JAVA' ? 'java' : language === 'PYTHON' ? 'py' : 'js'}
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Interactive Code Editor Area */}
          <div className="flex-1 flex overflow-hidden font-mono text-xs bg-white min-h-0">
            {/* Line numbers */}
            <div className="w-12 bg-slate-50 select-none text-right pr-3 py-4 text-slate-400 font-mono leading-6 border-r border-slate-200 overflow-hidden">
              {Array.from({ length: Math.max(lineCount, 24) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Textarea with dedicated clean scrollbar */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 p-4 bg-white text-slate-900 resize-none focus:outline-none font-mono leading-6 whitespace-pre overflow-y-auto selection:bg-blue-100 selection:text-blue-900 [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent]"
              style={{ tabSize: 4 }}
            />
          </div>

          {/* Bottom Execution Results Console */}
          <div className="h-64 border-t border-slate-200 bg-white flex flex-col shrink-0">
            <div className="h-10 bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
              <div className="flex space-x-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('testcases')}
                  className={`flex items-center space-x-1.5 pb-1 border-b-2 transition pt-1.5 ${
                    activeTab === 'testcases'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>Test Results</span>
                  {result && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                        result.status === 'PASSED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {result.passedTestCases}/{result.totalTestCases}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('console')}
                  className={`flex items-center space-x-1.5 pb-1 border-b-2 transition pt-1.5 ${
                    activeTab === 'console'
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Output Console</span>
                </button>
              </div>

              {result && (
                <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{result.totalExecutionTimeMs}ms</span>
                  </span>
                </div>
              )}
            </div>

            {/* Tab Contents with dedicated clean scrollbar */}
            <div className="flex-1 p-4 overflow-y-auto text-xs font-mono bg-white [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent]">
              {activeTab === 'testcases' ? (
                result ? (
                  <div className="space-y-3">
                    <div
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        result.status === 'PASSED'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {result.status === 'PASSED' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600" />
                        )}
                        <span className="font-bold">{result.message}</span>
                      </div>
                      <span className="text-[11px] font-semibold">
                        Passed {result.passedTestCases} of {result.totalTestCases} Test Cases
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.results.map((tc, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border ${
                            tc.passed
                              ? 'bg-emerald-50/40 border-emerald-200'
                              : 'bg-rose-50/40 border-rose-200'
                          }`}
                        >
                          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200">
                            <span className="font-bold text-slate-900">{tc.name}</span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                tc.passed
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : 'bg-rose-100 text-rose-800 border-rose-300'
                              }`}
                            >
                              {tc.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 space-y-1">
                            <div>
                              <span className="text-slate-400">Input:</span> <span className="text-slate-800">{tc.input}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Expected:</span>{' '}
                              <span className="text-emerald-700 font-semibold">{tc.expectedOutput}</span>
                            </div>
                            <div>
                              <span className="text-slate-400">Actual:</span>{' '}
                              <span
                                className={tc.passed ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}
                              >
                                {tc.actualOutput}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-400 py-8 text-center flex flex-col items-center justify-center space-y-1">
                    <Terminal className="w-5 h-5 text-slate-300" />
                    <span>Click "Run & Test" to compile your solution against verification suites.</span>
                  </div>
                )
              ) : (
                <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {result?.stdout ||
                    result?.stderr ||
                    'Ready to execute. Standard output, logging traces, and compiler metrics will stream here.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

