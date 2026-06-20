'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import type { Theme } from '@/lib/themes';

export default function Home() {
  const [notes, setNotes] = useState('');
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [synthesis, setSynthesis] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'notes' | 'themes' | 'quotes'>('notes');
  const [highlightKeywords, setHighlightKeywords] = useState(true);
  const [quotesPerTheme, setQuotesPerTheme] = useState(5);
  const [expandedThemes, setExpandedThemes] = useState<Set<string>>(new Set());
  const [hideUntagged, setHideUntagged] = useState(false);
  const [sentenceThemes, setSentenceThemes] = useState<Map<string, string>>(new Map());
  const [expandNotes, setExpandNotes] = useState(true);
  const [editingQuoteIdx, setEditingQuoteIdx] = useState<number | null>(null);

  // Load default themes on mount
  useEffect(() => {
    fetch('/api/themes')
      .then((r) => r.json())
      .then((data) => setThemes(data.themes))
      .catch((e) => console.error('Failed to load themes:', e));
  }, []);

  // Auto-collapse notes when synthesis appears
  useEffect(() => {
    if (synthesis) {
      setExpandNotes(false);
    }
  }, [synthesis]);

  const handleSynthesizeNotes = async () => {
    if (!notes.trim()) {
      alert('Please paste your interview notes.');
      return;
    }

    if (themes.length === 0) {
      alert('Please add at least one theme.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, themes, quotesPerTheme }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to synthesize notes');
      }

      const data = await response.json();
      setSynthesis(data);
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateThemeThreshold = (themeId: string, value: number) => {
    setThemes((prev) =>
      prev.map((t) => (t.id === themeId ? { ...t, closenessThreshold: Math.max(0, Math.min(1, value)) } : t))
    );
  };

  const handleRemoveTheme = (themeId: string) => {
    setThemes((prev) => {
      const themeName = prev.find(t => t.id === themeId)?.name;
      // Remove manual assignments for this theme
      if (themeName) {
        const newMap = new Map(sentenceThemes);
        for (const [quote, theme] of newMap.entries()) {
          if (theme === themeName) {
            newMap.delete(quote);
          }
        }
        setSentenceThemes(newMap);
      }
      return prev.filter((t) => t.id !== themeId);
    });
  };

  const toggleThemeExpanded = (themeId: string) => {
    setExpandedThemes((prev) => {
      const next = new Set(prev);
      if (next.has(themeId)) {
        next.delete(themeId);
      } else {
        next.add(themeId);
      }
      return next;
    });
  };

  const getThemeColor = (themeName?: string) => {
    const colors: Record<string, string> = {
      'Pain Point': 'bg-red-100 text-red-800',
      'User Need': 'bg-blue-100 text-blue-800',
      'Workaround': 'bg-purple-100 text-purple-800',
      'Positive Feedback': 'bg-green-100 text-green-800',
      'Mental Model Insight': 'bg-yellow-100 text-yellow-800',
    };
    return colors[themeName || ''] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header - hidden for now */}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-brand-200">
        <button
          onClick={() => {
            setActiveTab('notes');
            setEditingQuoteIdx(null);
          }}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'notes'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-600 hover:text-brand-600'
          }`}
        >
          Interview Report
        </button>
        <button
          onClick={() => {
            setActiveTab('themes');
            setEditingQuoteIdx(null);
          }}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'themes'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-gray-600 hover:text-brand-600'
          }`}
        >
          Themes ({themes.length})
        </button>
        {synthesis && (
          <button
            onClick={() => {
              setActiveTab('quotes');
              setEditingQuoteIdx(null);
            }}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'quotes'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-gray-600 hover:text-brand-600'
            }`}
          >
            Quotes ({synthesis.sentences?.length || 0})
          </button>
        )}
      </div>

      <div className="pt-6">

      {/* Notes Tab */}
      {activeTab === 'notes' && (
        <div>
          {/* Show/hide button - always visible */}
          {synthesis && (
            <button
              onClick={() => setExpandNotes(!expandNotes)}
              className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-2 justify-end w-full"
            >
              <span>Interview Notes ({notes.length} chars)</span>
              {expandNotes ? (
                <>
                  <EyeSlashIcon className="w-4 h-4" />
                  <span className="text-xs">hide</span>
                </>
              ) : (
                <>
                  <EyeIcon className="w-4 h-4" />
                  <span className="text-xs">show</span>
                </>
              )}
            </button>
          )}

          {/* Notes content - fades out when synthesis appears */}
          <div className={synthesis && !expandNotes ? 'animate-fade-out-up' : ''}>
            {(expandNotes || !synthesis) && (
              <>
                <label className="block mb-4">
                  <textarea
                    value={notes}
                    onChange={(e) => {
                      console.log('[textarea] Changed, value length:', e.target.value.length);
                      setNotes(e.target.value);
                    }}
                    placeholder="Paste your raw interview transcripts or notes here. Minimum 10 sentences recommended..."
                    className="mt-2 block w-full h-48 px-4 py-3 border border-brand-200 rounded-lg bg-white text-brand-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600"
                  />
                </label>

                <button
                  onClick={handleSynthesizeNotes}
                  disabled={isLoading || themes.length === 0 || !notes.trim()}
                  className="px-6 py-3 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      Synthesizing
                      <span className="animate-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </span>
                    </>
                  ) : (
                    'Synthesize Notes'
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Themes Tab */}
      {activeTab === 'themes' && (
        <div>
          <div className="space-y-4">
            {themes.map((theme) => (
              <div key={theme.id} className="bg-white border border-brand-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-brand-900">{theme.name}</h4>
                  {!theme.id.startsWith('default') && (
                    <button
                      onClick={() => handleRemoveTheme(theme.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <p className="text-sm text-gray-700">{theme.definition}</p>

                <div className="space-y-2">
                  <label className="block text-sm">
                    <span className="text-gray-700">
                      Sensitivity: {(theme.closenessThreshold * 100).toFixed(0)}%
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={theme.closenessThreshold * 100}
                      onChange={(e) => handleUpdateThemeThreshold(theme.id, parseFloat(e.target.value) / 100)}
                      className="mt-2 w-full"
                    />
                    <span className="text-xs text-gray-500">
                      Lower = more matches (looser), Higher = fewer matches (stricter)
                    </span>
                  </label>
                </div>

                {theme.keywords && theme.keywords.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex gap-1 flex-wrap">
                      {(expandedThemes.has(theme.id)
                        ? theme.keywords
                        : theme.keywords.slice(0, 5)
                      ).map((kw) => (
                        <span key={kw} className="text-xs bg-brand-100 text-brand-700 px-2 py-1 rounded">
                          {kw}
                        </span>
                      ))}
                    </div>
                    {theme.keywords.length > 5 && (
                      <button
                        onClick={() => toggleThemeExpanded(theme.id)}
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                      >
                        {expandedThemes.has(theme.id)
                          ? '- hide keywords'
                          : `+ ${theme.keywords.length - 5} more`
                        }
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {themes.length === 0 && (
            <div className="text-center text-gray-600">
              <p>No themes loaded. Go to the Notes tab to start—default themes will be loaded automatically.</p>
            </div>
          )}
        </div>
      )}

      {/* Results - only show on Notes tab */}
      {synthesis && activeTab === 'notes' && (
        <div className="space-y-6 bg-white p-8 rounded-lg border border-brand-200 animate-fade-in">
            <div>
              <h3 className="text-2xl font-bold text-brand-900 mb-2">Interview Report</h3>
              <p className="text-sm text-gray-600">
                {synthesis.themes.length} theme{synthesis.themes.length === 1 ? '' : 's'} with extracted quotes.
              </p>
            </div>

          {synthesis.themes.length === 0 && (
            <p className="text-gray-600 py-4">
              No matches found. Try adjusting theme sensitivity or checking your interview notes.
            </p>
          )}

          {synthesis.themes.map((theme: any, idx: number) => {
            // Merge manually assigned quotes with synthesis results
            const manuallyAssigned = synthesis.sentences
              ?.filter(s => sentenceThemes.get(s.text) === theme.name && !s.themeName)
              .map(s => ({ text: s.text, similarity: 0, keywordBoost: 0 })) || [];

            const allQuotes = [...(theme.quotes || []), ...manuallyAssigned];

            return (
            <div key={idx} className="border-l-4 border-brand-600 pl-4 space-y-3">
              <div className="flex items-baseline gap-3">
                <h4 className="text-lg font-bold text-brand-900">{theme.name} ({allQuotes.length})</h4>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    theme.severity === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : theme.severity === 'important'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {theme.severity}
                </span>
              </div>

              <p className="text-sm text-gray-700">{theme.definition}</p>

              {allQuotes.length > 0 && (
                <div className="space-y-2 mt-2 bg-gray-50 p-3 rounded">
                  <ul className="space-y-2">
                    {allQuotes.map((quote: any, qIdx: number) => (
                      <li key={qIdx} className="text-sm text-gray-700">
                        <span className="italic">
                          "{highlightKeywords
                            ? highlightKeywordsInText(quote.text, theme.keywords)
                            : quote.text}"
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          (match: {(quote.similarity * 100).toFixed(0)}%)
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            );
          })}

          <div className="mt-6 space-y-3">
            <h4 className="font-bold text-brand-900">Markdown Preview</h4>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
              <code>{generateMarkdown(synthesis)}</code>
            </pre>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                const markdown = generateMarkdown(synthesis);
                navigator.clipboard.writeText(markdown).then(() => {
                  alert('Copied to clipboard!');
                }).catch(() => {
                  alert('Failed to copy. Try downloading instead.');
                });
              }}
              className="px-4 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={() => {
                const markdown = generateMarkdown(synthesis);
                downloadMarkdown(markdown);
              }}
              className="px-4 py-2 bg-brand-600 text-white font-medium rounded-lg hover:bg-brand-700 transition-colors"
            >
              Download as Markdown
            </button>
          </div>
        </div>
      )}

      {/* Quotes Tab */}
      {activeTab === 'quotes' && synthesis && (
        <div className="space-y-4">
          <div className="flex items-center justify-end">
            <button
              onClick={() => setHideUntagged(!hideUntagged)}
              className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
            >
              <span>{hideUntagged ? 'All quotes' : 'Untagged quotes'}</span>
              <EyeIcon className="w-4 h-4" />
              <span className="text-xs">{hideUntagged ? 'show' : 'hide'}</span>
            </button>
          </div>

          <div className="bg-white rounded-lg border border-brand-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-50 border-b border-brand-200">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-brand-900">#</th>
                  <th className="text-left px-4 py-2 font-medium text-brand-900">Quote</th>
                  <th className="text-left px-4 py-2 font-medium text-brand-900">Theme</th>
                </tr>
              </thead>
              <tbody>
                {synthesis.sentences
                  ?.map((quote, originalIdx) => ({ quote, originalIdx }))
                  .filter(({ quote }) => !hideUntagged || quote.themeName || sentenceThemes.has(quote.text))
                  .map(({ quote, originalIdx }) => (
                    <tr key={`quote-${originalIdx}`} className="border-b border-brand-100 hover:bg-brand-50">
                      <td className="px-4 py-3 text-gray-500 w-8">{originalIdx + 1}</td>
                      <td className="px-4 py-3 text-gray-700 max-w-2xl">{quote.text}</td>
                      <td className="px-4 py-3 min-w-48">
                        {editingQuoteIdx === originalIdx ? (
                          <select
                            autoFocus
                            onChange={(e) => {
                              if (e.target.value) {
                                const newMap = new Map(sentenceThemes);
                                newMap.set(quote.text, e.target.value);
                                setSentenceThemes(newMap);
                              }
                              setEditingQuoteIdx(null);
                            }}
                            onBlur={() => setEditingQuoteIdx(null)}
                            className="text-xs px-2 py-1 border border-brand-200 rounded bg-white text-gray-700 w-full"
                            value={quote.themeName || sentenceThemes.get(quote.text) || ''}
                          >
                            <option value="">Select theme...</option>
                            {synthesis.themes.map((theme) => (
                              <option key={theme.name} value={theme.name}>
                                {theme.name}
                              </option>
                            ))}
                          </select>
                        ) : quote.themeName || sentenceThemes.get(quote.text) ? (
                          <button
                            onClick={() => setEditingQuoteIdx(originalIdx)}
                            className={`inline-block px-3 py-1 rounded text-xs font-medium hover:opacity-80 cursor-pointer ${getThemeColor(quote.themeName || sentenceThemes.get(quote.text))}`}
                          >
                            {quote.themeName || sentenceThemes.get(quote.text)}
                          </button>
                        ) : (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                const newMap = new Map(sentenceThemes);
                                newMap.set(quote.text, e.target.value);
                                setSentenceThemes(newMap);
                              }
                            }}
                            className="text-xs px-2 py-1 border border-brand-200 rounded bg-white text-gray-700 w-full"
                            value={sentenceThemes.get(quote.text) || ''}
                          >
                            <option value="">Select theme...</option>
                            {synthesis.themes.map((theme) => (
                              <option key={theme.name} value={theme.name}>
                                {theme.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500">
            Total quotes: {synthesis.sentences?.length || 0} | Tagged: {synthesis.sentences?.filter(s => s.themeName || sentenceThemes.has(s.text)).length || 0}
          </p>
        </div>
      )}

      </div>
    </div>
  );
}

function generateMarkdown(synthesis: any) {
  let md = '# Research Synthesis\n\n';
  md += `Generated: ${new Date().toLocaleDateString()}\n\n`;

  synthesis.themes.forEach((theme: any) => {
    md += `## ${theme.name}\n\n`;
    md += `**Severity:** ${theme.severity}\n\n`;
    md += `${theme.definition}\n\n`;

    if (theme.quotes.length > 0) {
      md += `### Matching Quotes (${theme.quotes.length})\n\n`;
      theme.quotes.forEach((quote: any) => {
        md += `> "${quote.text}"\n\n`;
      });
    }

    md += `---\n\n`;
  });

  return md;
}

function highlightKeywordsInText(text: string, keywords?: string[]): JSX.Element | string {
  if (!keywords || keywords.length === 0 || !text) {
    return text;
  }

  console.log('[highlight] Text:', text.substring(0, 50) + '...', 'Keywords count:', keywords.length);

  // Create regex pattern with word boundaries
  const validKeywords = keywords.filter(k => k && k.trim().length > 0);
  if (validKeywords.length === 0) return text;

  // Escape special regex characters and create pattern
  const escapedKeywords = validKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = escapedKeywords.join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');

  console.log('[highlight] Pattern:', pattern.substring(0, 100));

  const parts = text.split(regex);
  console.log('[highlight] Parts count:', parts.length);

  return (
    <>
      {parts.map((part, idx) => {
        if (!part) return null;
        // Check if this part is a keyword (was matched by regex)
        const isKeyword = validKeywords.some(k => k.toLowerCase() === part.toLowerCase());
        if (isKeyword) {
          return (
            <strong key={idx} className="bg-yellow-300 font-bold">
              {part}
            </strong>
          );
        }
        return <span key={idx}>{part}</span>;
      })}
    </>
  );
}

function downloadMarkdown(content: string) {
  const element = document.createElement('a');
  element.setAttribute('href', `data:text/markdown;charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', `synthesis-${new Date().toISOString().split('T')[0]}.md`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
