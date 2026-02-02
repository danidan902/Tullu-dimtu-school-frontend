
import { ChevronLeft } from "lucide-react";
import { notesGrade9 } from "../data/note";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentNotes1() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [pdfViewerHeight, setPdfViewerHeight] = useState("h-[calc(100vh-120px)]");
  const navigate = useNavigate();

  // Get unique categories
  const categories = ['all', ...new Set(notesGrade9.map(note => note.grade))];

  // Filter notes based on active category and search
  const filteredNotes = notesGrade9.filter(note => {
    const matchesCategory = activeCategory === 'all' || note.grade === activeCategory;
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between h-auto md:h-20 py-4 md:py-0">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="ml-3">
                 <div className="fixed left-2 sm:left-4 top-2 sm:top-4 z-20">
                                    <button
                                      onClick={() => navigate('/studentstudy-dashboard')}
                                      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                                      aria-label="Go back"
                                    >
                                      <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                                    </button>
                                  </div>
                <h1 className="text-xl font-bold text-gray-900 ml-16 md:ml-8">Grade 9</h1>
              </div>
            </div>

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 pl-10 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeCategory === category
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All Grades' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedPdf ? (
          // Notes Grid View
          <div className="space-y-8">
            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedPdf(note)}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100">
                        {note.grade}
                      </span>
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {note.title}
                    </h3>

                    <div className="flex items-center text-gray-700 mb-6">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg mr-3">
                        <span className="text-gray-600">📘</span>
                      </div>
                      <span className="font-medium">{note.subject}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-sm font-semibold text-blue-600">Short Note</span>
                        <p className="text-xs text-gray-500 mt-1">Click to open in viewer</p>
                      </div>
                      <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full group-hover:from-blue-100 group-hover:to-indigo-100 transition-colors">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // PDF Viewer Section
          <div className="space-y-6">
            {/* PDF Viewer Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setSelectedPdf(null)}
                      className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      <span className="hidden sm:inline">Back to Notes</span>
                    </button>
                    
                    {/* Height Controls for Desktop */}
                    <div className="hidden md:flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Viewer Height:</span>
                      <div className="flex bg-gray-100 rounded-lg p-1">
                       <button
  onClick={() => setPdfViewerHeight("h-[calc(100vh-120px)]")}
  className={`px-3 py-1 text-sm rounded-md transition-colors ${
    pdfViewerHeight === "h-[calc(100vh-120px)]"
      ? "bg-white shadow"
      : "hover:bg-gray-200"
  }`}
>
  Extra Large
</button>

<button
  onClick={() => setPdfViewerHeight("h-[80vh]")}
  className={`px-3 py-1 text-sm rounded-md transition-colors ${
    pdfViewerHeight === "h-[80vh]"
      ? "bg-white shadow"
      : "hover:bg-gray-200"
  }`}
>
  Large
</button>

<button
  onClick={() => setPdfViewerHeight("h-[65vh]")}
  className={`px-3 py-1 text-sm rounded-md transition-colors ${
    pdfViewerHeight === "h-[65vh]"
      ? "bg-white shadow"
      : "hover:bg-gray-200"
  }`}
>
  Medium
</button>

<button
  onClick={() => setPdfViewerHeight("h-[50vh]")}
  className={`px-3 py-1 text-sm rounded-md transition-colors ${
    pdfViewerHeight === "h-[50vh]"
      ? "bg-white shadow"
      : "hover:bg-gray-200"
  }`}
>
  Small
</button>

                      </div>
                    </div>
                  </div>
                  
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                    {selectedPdf.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100">
                      {selectedPdf.grade}
                    </span>
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                      📘 {selectedPdf.subject}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-4 md:hidden">
                <button
                  onClick={() => window.open(selectedPdf.pdf, '_blank')}
                  className="flex-1 min-w-[120px] inline-flex items-center justify-center px-3 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedPdf.pdf;
                    link.download = selectedPdf.title + '.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="flex-1 min-w-[120px] inline-flex items-center justify-center px-3 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
                <a href="/grade9" className="flex-1 min-w-[120px]">
                  <button className="w-full inline-flex items-center justify-center px-3 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Start Exam
                  </button>
                </a>
              </div>

              {/* Desktop Action Buttons */}
              <div className="hidden md:flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => window.open(selectedPdf.pdf, '_blank')}
                  className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in New Tab
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedPdf.pdf;
                    link.download = selectedPdf.title + '.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
                <a href="/grade9">
                  <button className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Start Exam
                  </button>
                </a>
              </div>
            </div>

            {/* PDF Viewer Container */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* PDF Header Bar */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {selectedPdf.title}.pdf
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Mobile Height Toggle */}
                    <div className="flex md:hidden bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setPdfViewerHeight("h-[calc(100vh-280px)]")}
                        className={`px-2 py-1 text-xs rounded-md transition-colors ${pdfViewerHeight.includes("calc") ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setPdfViewerHeight("h-[100vh]")}
                        className={`px-2 py-1 text-xs rounded-md transition-colors ${pdfViewerHeight === "h-[70vh]" ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
                        </svg>
                      </button>
                    </div>
                    
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      PDF Viewer • Scroll to navigate
                    </span>
                  </div>
                </div>
              </div>

              {/* PDF Embed - Responsive Height */}
              <div className={`${pdfViewerHeight} w-full bg-gray-900`}>
                <iframe
                  src={`${selectedPdf.pdf}#view=fitH&toolbar=1&navpanes=0&scrollbar=1`}
                  className="w-full h-full border-0"
                  title={`PDF Viewer - ${selectedPdf.title}`}
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              {/* Viewer Controls Footer */}
              <div className="bg-gray-50 border-t border-gray-200 px-4 py-3">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                
                  
                  <div className="text-sm text-gray-500">
                    <a
                      href="https://get.adobe.com/reader/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Need Adobe Reader?
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Notes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Notes</h3>
                




              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notesGrade9
                  .filter(note => 
                    note.subject === selectedPdf.subject && 
                    note.pdf !== selectedPdf.pdf
                  )
                  .slice(0, 2)
                  .map((note, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedPdf(note)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                            {note.title}
                          </h4>
                          <div className="flex items-center mt-1">
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded mr-2">
                              {note.grade}
                            </span>
                            <span className="text-sm text-gray-500">{note.subject}</span>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}