import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

const API_BASE = 'http://localhost:3001/api';
const VIDEO_BASE = 'http://localhost:3001/videos';

const PlaywrightTestRunner = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [runAll, setRunAll] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [expandedErrors, setExpandedErrors] = useState(new Set());
  const [expandedVideos, setExpandedVideos] = useState(new Set());
  const [currentRunningTest, setCurrentRunningTest] = useState('');
  const [totalTests, setTotalTests] = useState(0);
  const [completedTests, setCompletedTests] = useState(0);

  // Load clients on component mount
  useEffect(() => {
    loadClients();
  }, []);

  // Load tests when client changes
  useEffect(() => {
    if (selectedClient) {
      loadTests(selectedClient);
    } else {
      setAvailableTests([]);
      setSelectedTests([]);
      setTestResults([]);
    }
  }, [selectedClient]);

  const loadClients = async () => {
    try {
      const response = await fetch(`${API_BASE}/clients`);
      const clientList = await response.json();
      // Handle both old format (array of strings) and new format (array of objects)
      if (Array.isArray(clientList) && clientList.length > 0) {
        if (typeof clientList[0] === 'string') {
          // Old format
          setClients(clientList.map(name => ({ name, description: '', baseURL: '' })));
        } else {
          // New format
          setClients(clientList);
        }
      }
    } catch (error) {
      console.error('Failed to load clients:', error);
      // Fallback to default clients if backend is not available
      setClients([
        { name: 'UK Field Service', description: 'UK Field Service platform tests', baseURL: 'https://ukfieldservice.com' },
        { name: 'Client A', description: 'Client A website tests', baseURL: 'https://clienta.example.com' },
        { name: 'Client B', description: 'Client B platform tests', baseURL: 'https://clientb.example.com' }
      ]);
    }
  };

  const loadTests = async (client) => {
    try {
      const response = await fetch(`${API_BASE}/tests/${client}`);
      const tests = await response.json();
      setAvailableTests(tests);
      setSelectedTests([]);
      setTestResults([]);
      setExpandedErrors(new Set());
      setExpandedVideos(new Set());
    } catch (error) {
      console.error('Failed to load tests:', error);
      // Fallback test files
      setAvailableTests(['login.spec.js', 'dashboard.spec.js', 'profile.spec.js']);
    }
  };

  const runTests = async () => {
    if (!selectedClient) {
      alert('Please select a client first');
      return;
    }

    if (!runAll && selectedTests.length === 0) {
      alert('Please select at least one test to run');
      return;
    }

    setIsRunning(true);
    setTestResults([]);
    setExpandedErrors(new Set());
    setExpandedVideos(new Set());
    setCurrentRunningTest('');
    setCompletedTests(0);

    try {
      const response = await fetch(`${API_BASE}/run-tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client: selectedClient,
          tests: selectedTests,
          runAll: runAll
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              handleTestUpdate(data);
            } catch (e) {
              console.error('Failed to parse SSE data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to run tests:', error);
      alert('Failed to run tests. Make sure the backend server is running.');
    }

    setIsRunning(false);
    setCurrentRunningTest('');
  };

  const handleTestUpdate = (data) => {
    switch (data.type) {
      case 'start':
        setTotalTests(data.totalTests);
        setCompletedTests(0);
        break;
     
      case 'running':
        setCurrentRunningTest(data.test);
        break;
     
      case 'result':
        setTestResults(prev => [...prev, {
          name: data.test,
          status: data.status,
          error: data.error,
          duration: data.duration,
          videoFile: data.videoFile
        }]);
        setCompletedTests(prev => prev + 1);
        setCurrentRunningTest('');
        break;
     
      case 'complete':
        setCurrentRunningTest('');
        break;
     
      case 'error':
        console.error('Test execution error:', data.error);
        alert(`Test execution failed: ${data.error}`);
        break;
     
      default:
        console.log('Unknown update type:', data.type);
    }
  };

  const handleTestSelection = (testName, checked) => {
    if (checked) {
      setSelectedTests(prev => [...prev, testName]);
    } else {
      setSelectedTests(prev => prev.filter(t => t !== testName));
    }
  };

  const toggleErrorDetails = (testName) => {
    setExpandedErrors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testName)) {
        newSet.delete(testName);
      } else {
        newSet.add(testName);
      }
      return newSet;
    });
  };

  const toggleVideo = (testName) => {
    setExpandedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testName)) {
        newSet.delete(testName);
      } else {
        newSet.add(testName);
      }
      return newSet;
    });
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const progress = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;
  const selectedClientObj = clients.find(c => (c.name || c) === selectedClient);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
    {/* Compact Header Section */}
    <div style={{
      background: 'linear-gradient(135deg, #0d7377 0%, #14a085 50%, #a8e6cf 100%)',
      color: 'white',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='2'/%3E%3Ccircle cx='27' cy='7' r='2'/%3E%3Ccircle cx='47' cy='7' r='2'/%3E%3Ccircle cx='7' cy='27' r='2'/%3E%3Ccircle cx='27' cy='27' r='2'/%3E%3Ccircle cx='47' cy='27' r='2'/%3E%3Ccircle cx='7' cy='47' r='2'/%3E%3Ccircle cx='27' cy='47' r='2'/%3E%3Ccircle cx='47' cy='47' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.1
      }} />
     
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Logo and Title */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'white',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '1rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            {/* Embedded Gatekeeper Logo */}
            <img
              src={`data:image/svg+xml;utf8,
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
                  <path fill='%232c3e50' d='M32 4l24 8v16c0 13.3-8.9 25.6-24 32C16.9 53.6 8 41.3 8 28V12l24-8z'/>
                  <path fill='none' stroke='%23ff6b35' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' d='M20 32l8 8 16-16'/>
                </svg>`}
              alt="Gatekeeper Logo"
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              margin: 0,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Gatekeeper
            </h1>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem'
            }}>
              <p style={{
                fontSize: '1.1rem',
                opacity: 0.9,
                margin: 0
              }}>
                Automated Test Runner
              </p>
              <p style={{
                fontSize: '0.9rem',
                opacity: 0.7,
                margin: 0,
                fontStyle: 'italic'
              }}>
                made by ZU
              </p>
            </div>
          </div>
        </div>
      </div>
     
      {/* Decorative wave */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50px',
        background: 'white',
        clipPath: 'polygon(0 60%, 100% 100%, 0 100%)'
      }} />
    </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        marginTop: '-25px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {/* Client Selection and Test Selection Side by Side */}
          <div style={{
            padding: '2rem',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: selectedClient ? '1fr 1fr' : '1fr',
              gap: '2rem'
            }}>
              {/* Client Selection */}
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    width: '8px',
                    height: '24px',
                    backgroundColor: '#0d7377',
                    borderRadius: '4px',
                    marginRight: '1rem'
                  }}></span>
                  Select Client
                </h3>
                <select
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                    transition: 'border-color 0.2s ease',
                    cursor: 'pointer'
                  }}
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  disabled={isRunning}
                  onFocus={(e) => e.target.style.borderColor = '#0d7377'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="">Choose a client...</option>
                  {clients.map(client => (
                    <option key={client.name || client} value={client.name || client}>
                      {client.name || client}
                      {client.description && ` - ${client.description}`}
                    </option>
                  ))}
                </select>
                {selectedClient && selectedClientObj?.baseURL && (
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#0d7377',
                    marginTop: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#f0fdfa',
                    borderRadius: '8px',
                    border: '1px solid #a7f3d0'
                  }}>
                    Base URL: {selectedClientObj.baseURL}
                  </p>
                )}
              </div>

              {/* Test Selection */}
              {selectedClient && (
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        width: '8px',
                        height: '24px',
                        backgroundColor: '#059669',
                        borderRadius: '4px',
                        marginRight: '1rem'
                      }}></span>
                      Select Tests
                    </h3>
                   
                    <button
                      onClick={runTests}
                      disabled={isRunning || (!runAll && selectedTests.length === 0) || availableTests.length === 0}
                      style={{
                        background: isRunning || (!runAll && selectedTests.length === 0) || availableTests.length === 0
                          ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                          : 'linear-gradient(135deg, #0d7377 0%, #14a085 100%)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: isRunning || (!runAll && selectedTests.length === 0) || availableTests.length === 0 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 20px rgba(13, 115, 119, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Play size={18} />
                      <span>{isRunning ? 'Running Tests...' : 'Run Tests'}</span>
                    </button>
                  </div>
                 
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      backgroundColor: runAll ? '#f0fdfa' : 'white',
                      borderRadius: '12px',
                      border: `2px solid ${runAll ? '#0d7377' : '#e5e7eb'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}>
                      <input
                        type="radio"
                        name="testSelection"
                        checked={runAll}
                        onChange={() => setRunAll(true)}
                        disabled={isRunning}
                        style={{ marginRight: '0.75rem' }}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>
                          Run All Tests
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                          Execute all {availableTests.length} available tests
                        </div>
                      </div>
                    </label>
                   
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1rem',
                      backgroundColor: !runAll ? '#f0fdfa' : 'white',
                      borderRadius: '12px',
                      border: `2px solid ${!runAll ? '#0d7377' : '#e5e7eb'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}>
                      <input
                        type="radio"
                        name="testSelection"
                        checked={!runAll}
                        onChange={() => setRunAll(false)}
                        disabled={isRunning}
                        style={{ marginRight: '0.75rem' }}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>
                          Select Specific Tests
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                          Choose individual test files
                        </div>
                      </div>
                    </label>
                  </div>

                  {!runAll && (
                    <div style={{
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      padding: '1rem',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      {availableTests.length > 0 ? (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}>
                          {availableTests.map(test => (
                            <label key={test} style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0.5rem',
                              backgroundColor: selectedTests.includes(test) ? '#f0fdfa' : 'white',
                              borderRadius: '8px',
                              border: `1px solid ${selectedTests.includes(test) ? '#0d7377' : '#e5e7eb'}`,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}>
                              <input
                                type="checkbox"
                                checked={selectedTests.includes(test)}
                                onChange={(e) => handleTestSelection(test, e.target.checked)}
                                disabled={isRunning}
                                style={{ marginRight: '0.75rem' }}
                              />
                              <span style={{
                                fontSize: '0.85rem',
                                fontFamily: 'monospace',
                                fontWeight: '500',
                                color: '#374151'
                              }}>
                                {test}
                              </span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <p style={{
                          color: '#6b7280',
                          fontSize: '0.9rem',
                          textAlign: 'center',
                          padding: '1rem'
                        }}>
                          No test files found for this client
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar Section */}
          {selectedClient && isRunning && totalTests > 0 && (
            <div style={{ padding: '2rem', paddingTop: '0' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <span style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>
                  Progress: {completedTests}/{totalTests}
                </span>
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#0d7377',
                  backgroundColor: '#f0fdfa',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px'
                }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '12px',
                backgroundColor: '#e5e7eb',
                borderRadius: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #0d7377 0%, #14a085 100%)',
                  width: `${progress}%`,
                  transition: 'width 0.3s ease',
                  borderRadius: '6px'
                }}></div>
              </div>
              {currentRunningTest && (
                <p style={{
                  fontSize: '0.9rem',
                  color: '#6b7280',
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  Currently running: <span style={{
                    fontFamily: 'monospace',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    {currentRunningTest}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            marginTop: '2rem',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '2rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{
                  width: '8px',
                  height: '24px',
                  backgroundColor: '#7c3aed',
                  borderRadius: '4px',
                  marginRight: '1rem'
                }}></span>
                Test Results
              </h3>

              {/* Summary Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '12px',
                  border: '1px solid #0ea5e9',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0284c7' }}>
                    {testResults.length}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: '500' }}>
                    Total Tests
                  </div>
                </div>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '12px',
                  border: '1px solid #22c55e',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
                    {testResults.filter(r => r.status === 'pass').length}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#15803d', fontWeight: '500' }}>
                    Passed
                  </div>
                </div>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#fef2f2',
                  borderRadius: '12px',
                  border: '1px solid #ef4444',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>
                    {testResults.filter(r => r.status === 'fail').length}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#b91c1c', fontWeight: '500' }}>
                    Failed
                  </div>
                </div>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#fafbfc',
                  borderRadius: '12px',
                  border: '1px solid #6b7280',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4b5563' }}>
                    {testResults.length > 0 ? Math.round((testResults.filter(r => r.status === 'pass').length / testResults.length) * 100) : 0}%
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#374151', fontWeight: '500' }}>
                    Success Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Test Results */}
            <div style={{ padding: '2rem' }}>
              {testResults.map((result, index) => (
                <div key={index} style={{
                  backgroundColor: '#fafbfc',
                  border: `1px solid ${result.status === 'pass' ? '#d1fae5' : '#fee2e2'}`,
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: result.status === 'fail' && (result.error || expandedErrors.has(result.name) || expandedVideos.has(result.name)) ? '1rem' : '0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {result.status === 'pass' ? (
                        <CheckCircle size={28} color="#22c55e" />
                      ) : (
                        <XCircle size={28} color="#ef4444" />
                      )}
                      <div>
                        <div style={{
                          fontFamily: 'monospace',
                          fontWeight: '600',
                          fontSize: '1rem',
                          color: '#374151',
                          marginBottom: '0.25rem'
                        }}>
                          {result.name}
                        </div>
                        {result.duration && (
                          <div style={{
                            fontSize: '0.8rem',
                            color: '#6b7280',
                            backgroundColor: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            display: 'inline-block'
                          }}>
                            {formatDuration(result.duration)}
                          </div>
                        )}
                      </div>
                      <span style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        backgroundColor: result.status === 'pass' ? '#22c55e' : '#ef4444',
                        color: 'white'
                      }}>
                        {result.status === 'pass' ? 'PASS' : 'FAIL'}
                      </span>
                    </div>
                    {result.status === 'fail' && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {result.error && (
                          <button
                            style={{
                              padding: '0.5rem 1rem',
                              border: '1px solid #f87171',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              backgroundColor: 'white',
                              color: '#dc2626',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => toggleErrorDetails(result.name)}
                          >
                            Details
                            {expandedErrors.has(result.name) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        )}
                        {result.videoFile && (
                          <button
                            style={{
                              padding: '0.5rem 1rem',
                              border: '1px solid #60a5fa',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              backgroundColor: 'white',
                              color: '#2563eb',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              transition: 'all 0.2s ease'
                            }}
                            onClick={() => toggleVideo(result.name)}
                          >
                            Play Video
                            {expandedVideos.has(result.name) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                 
                  {result.status === 'fail' && result.error && expandedErrors.has(result.name) && (
                    <div style={{
                      padding: '1.5rem',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '12px',
                      marginTop: '1rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}>
                        <XCircle size={18} color="#dc2626" />
                        <span style={{ fontWeight: '600', color: '#dc2626', fontSize: '1rem' }}>
                          Error Details
                        </span>
                      </div>
                      <pre style={{
                        fontSize: '0.85rem',
                        color: '#b91c1c',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'monospace',
                        backgroundColor: 'white',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #f87171',
                        overflow: 'auto',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        {result.error}
                      </pre>
                    </div>
                  )}

                  {result.status === 'fail' && result.videoFile && expandedVideos.has(result.name) && (
                    <div style={{
                      padding: '1.5rem',
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '12px',
                      marginTop: '1rem'
                    }}>
                      <p style={{
                        fontWeight: '600',
                        color: '#1d4ed8',
                        marginBottom: '1rem',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        🎥 Test Video: {result.name}
                      </p>
                      <video
                        controls
                        style={{
                          borderRadius: '8px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          width: '100%',
                          maxWidth: '800px',
                          backgroundColor: '#000'
                        }}
                      >
                        <source src={`${VIDEO_BASE}/${result.videoFile}`} type="video/webm" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaywrightTestRunner;