import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import documentService from '../../services/documentService';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Tabs from '../../components/common/Tabs';
import ChatInterface from '../../components/chat/ChatInterface';
import AIActions from '../../components/ai/AIActions';
import Modal from '../../components/common/Modal';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';
import FlashcardManager from '../../components/flashcards/FlashcardManager';
import QuizManager from '../../components/quizzes/QuizManager';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000';

const DocumentDetailPage = () => {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Content');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch document details');
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  // ✅ Stable, safe PDF URL (no render crash)
  const pdfUrl = useMemo(() => {
    if (!id) return null;
    return `${API_BASE_URL}/api/documents/${id}/file`;
  }, [id]);

  {/*const renderContent = () => {
    if (loading) return <Spinner />;

    if (!pdfUrl) {
      return (
        <div className="text-center p-8 text-slate-500">
          PDF not available.
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300">
          <span className="text-sm font-medium text-gray-700">
            Document Viewer
          </span>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <ExternalLink size={16} />
            Open in new tab
          </a>
        </div>

        <iframe
          src={pdfUrl}
          className="w-full h-[70vh] bg-white"
          title="PDF Viewer"
        />
      </div>
    );
  }; */}

  const tabs = [
   {/* { name: 'Content', label: 'Content', content: renderContent() }, */},
    { name: 'Chat', label: 'Chat', content: <ChatInterface /> },
    {
      name: 'AI Actions',
      label: 'AI Actions',
      content: (
        <AIActions
          onOpenModal={(title, content) => {
            setModalTitle(title);
            setModalContent(content);
            setIsModalOpen(true);
          }}
        />
      ),
    },
    {
      name: 'Flashcards',
      label: 'Flashcards',
      content: <FlashcardManager documentId={id} />,
    },
    {
      name: 'Quizzes',
      label: 'Quizzes',
      content: <QuizManager documentId={id} />,
    },
  ];

  if (loading) return <Spinner />;

  if (!document) {
    return (
      <div className="text-center p-8 text-slate-500">
        Document not found.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm text-neutral-600"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>

      <PageHeader title={document.data?.title || 'Untitled Document'} />

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        <div className="max-h-[60vh] overflow-y-auto">
          <MarkdownRenderer content={modalContent} />
        </div>
      </Modal>
    </div>
  );
};

export default DocumentDetailPage;
