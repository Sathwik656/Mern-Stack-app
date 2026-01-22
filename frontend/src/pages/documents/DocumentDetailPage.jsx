import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import documentService from '../../services/documentService';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Tabs from '../../components/common/Tabs';
import ChatInterface from '../../components/chat/ChatInterface';
import AIActions from '../../components/ai/AIActions';
import Modal from '../../components/common/Modal';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';
import FlashcardManager from '../../components/flashcards/FlashcardManager';
import QuizManager from '../../components/quizzes/QuizManager';

const DocumentDetailPage = () => {
  const { id } = useParams();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIX: Default tab is now Chat
  const [activeTab, setActiveTab] = useState('Chat');

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

  const tabs = [
    {
      name: 'Chat',
      label: 'Chat',
      content: <ChatInterface />,
    },
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
