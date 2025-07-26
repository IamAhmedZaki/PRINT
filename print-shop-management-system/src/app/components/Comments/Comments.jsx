import React, { useState } from 'react';

// Mock comments data
const comments = [
  {
    id: 1,
    orderId: 'ORD-001',
    customer: 'John Smith',
    text: 'Logo looks great! Please proceed with the embroidery setup.',
    author: 'John Smith',
    authorType: 'customer',
    timestamp: '2025-01-15 02:20 PM',
    type: 'public',
    workflowState: 'design',
    replies: [
      {
        id: 11,
        text: 'Thank you! We\'ll start the embroidery process now.',
        author: 'Sarah Designer',
        authorType: 'team',
        timestamp: '2025-01-15 02:25 PM',
        type: 'public',
      },
    ],
  },
  {
    id: 2,
    orderId: 'ORD-003',
    customer: 'Sports Club',
    text: 'The mockup needs some adjustments. Can we make the logo 20% larger?',
    author: 'Sports Club Manager',
    authorType: 'customer',
    timestamp: '2025-01-16 10:15 AM',
    type: 'public',
    workflowState: 'mockup',
    replies: [],
  },
  {
    id: 3,
    orderId: 'ORD-001',
    customer: 'John Smith',
    text: 'Updated design with customer feedback. Ready for final approval.',
    author: 'Sarah Designer',
    authorType: 'team',
    timestamp: '2025-01-16 02:20 PM',
    type: 'internal',
    workflowState: 'design',
    replies: [],
  },
  {
    id: 4,
    orderId: 'ORD-002',
    customer: 'ABC Company',
    text: 'DTF print quality looks excellent. Approved for production.',
    author: 'Quality Team',
    authorType: 'team',
    timestamp: '2025-01-16 03:45 PM',
    type: 'internal',
    workflowState: 'printing',
    replies: [],
  },
  {
    id: 5,
    orderId: 'ORD-005',
    customer: 'Tech Startup',
    text: 'When will the order be ready for pickup?',
    author: 'Tech Startup',
    authorType: 'customer',
    timestamp: '2025-01-16 04:10 PM',
    type: 'public',
    workflowState: 'finishing',
    replies: [],
  },
];

function Comments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedTab, setSelectedTab] = useState('recent');
  const [newComment, setNewComment] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [commentType, setCommentType] = useState('public');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || comment.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const publicComments = filteredComments.filter((c) => c.type === 'public');
  const internalComments = filteredComments.filter((c) => c.type === 'internal');
  const recentComments = filteredComments.slice(0, 10);

  const getCommentsToDisplay = () => {
    switch (selectedTab) {
      case 'public':
        return publicComments;
      case 'internal':
        return internalComments;
      default:
        return recentComments;
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
  };

  const submitReply = (commentId) => {
    if (replyText.trim()) {
      const updatedComments = comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...(comment.replies || []),
                {
                  id: Date.now(),
                  text: replyText,
                  author: 'Current User',
                  authorType: 'team',
                  timestamp: new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                  type: commentType,
                },
              ],
            }
          : comment
      );
      // Update the comments state (in a real app, this would be an API call)
      setReplyingTo(null);
      setReplyText('');
    }
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="bg-white p-8 rounded-lg border-[1px] border-[#e5e7eb]">
          <h3 className="text-sm font-medium text-[#111928] mb-3">Total Comments</h3>
          <div className="text-2xl font-bold text-[#111928]">{comments.length}</div>
          <p className="text-xs text-[#9ca3af] mt-1">All conversations</p>
        </div>
        <div className="bg-white p-8 rounded-lg border-[1px] border-[#e5e7eb]">
          <h3 className="text-sm font-medium text-[#111928] mb-3">Public Comments</h3>
          <div className="text-2xl font-bold text-[#111928]">{publicComments.length}</div>
          <p className="text-xs text-[#9ca3af] mt-1">Customer visible</p>
        </div>
        <div className="bg-white p-8 rounded-lg border-[1px] border-[#e5e7eb]">
          <h3 className="text-sm font-medium text-[#111928] mb-3">Internal Notes</h3>
          <div className="text-2xl font-bold text-[#111928]">{internalComments.length}</div>
          <p className="text-xs text-[#9ca3af] mt-1">Team only</p>
        </div>
        <div className="bg-white p-8 rounded-lg border-[1px] border-[#e5e7eb]">
          <h3 className="text-sm font-medium text-[#111928] mb-3">Pending Replies</h3>
          <div className="text-2xl font-bold text-[#111928]">3</div>
          <p className="text-xs text-[#9ca3af] mt-1">Need response</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg border-[1px] border-[#e5e7eb] mb-8">
        <div className="mb-4">
          <h2 className="font-medium text-gray-800 text-[24px]">Comment Management</h2>
          <p className="text-[18px] text-[#9ca3af]">Search and filter through all comments and communications</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] placeholder:text-[#9ca3af]"
            />
          </div>
          <div className="flex space-x-3">
            <button
              className={`py-2 px-4 rounded-lg font-medium ${filterType === 'all' ? 'bg-[#5750f1] text-white' : 'bg-gray-200 text-[#111928] hover:bg-gray-300'}`}
              onClick={() => setFilterType('all')}
            >
              All
            </button>
            <button
              className={`py-2 px-4 rounded-lg font-medium ${filterType === 'public' ? 'bg-[#5750f1] text-white' : 'bg-gray-200 text-[#111928] hover:bg-gray-300'}`}
              onClick={() => setFilterType('public')}
            >
              Public
            </button>
            <button
              className={`py-2 px-4 rounded-lg font-medium ${filterType === 'internal' ? 'bg-[#5750f1] text-white' : 'bg-gray-200 text-[#111928] hover:bg-gray-300'}`}
              onClick={() => setFilterType('internal')}
            >
              Internal
            </button>
          </div>
        </div>
      </div>

      {/* Comments Tabs */}
      <div className="bg-white p-6 rounded-lg border-[1px] border-[#e5e7eb] mb-8">
        <div className="flex space-x-4 mb-6 border-b border-[#e5e7eb]">
          <button
            className={`pb-2 px-4 font-medium ${selectedTab === 'recent' ? 'border-b-2 border-[#5750f1] text-[#5750f1]' : 'text-[#9ca3af] hover:text-[#111928]'}`}
            onClick={() => setSelectedTab('recent')}
          >
            Recent Comments
          </button>
          <button
            className={`pb-2 px-4 font-medium ${selectedTab === 'public' ? 'border-b-2 border-[#5750f1] text-[#5750f1]' : 'text-[#9ca3af] hover:text-[#111928]'}`}
            onClick={() => setSelectedTab('public')}
          >
            Public ({publicComments.length})
          </button>
          <button
            className={`pb-2 px-4 font-medium ${selectedTab === 'internal' ? 'border-b-2 border-[#5750f1] text-[#5750f1]' : 'text-[#9ca3af] hover:text-[#111928]'}`}
            onClick={() => setSelectedTab('internal')}
          >
            Internal ({internalComments.length})
          </button>
        </div>
        <div className="space-y-6">
          {getCommentsToDisplay().map((comment) => (
            <div
              key={comment.id}
              className={`p-5 rounded-lg border-l-4 ${
                comment.type === 'public' ? 'border-blue-500 bg-blue-50' : 'border-gray-500 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium bg-[#f7f9fc] px-3 py-1 rounded">{comment.orderId}</span>
                  <span className="font-medium text-[#111928]">{comment.author}</span>
                  <span
                    className={`text-xs px-3 py-1 rounded ${
                      comment.type === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {comment.type}
                  </span>
                  <span className="text-xs bg-[#f7f9fc] px-3 py-1 rounded">{comment.workflowState}</span>
                </div>
                <div className="text-sm text-[#9ca3af]">{comment.timestamp}</div>
              </div>
              <p className="text-sm text-[#111928] mb-3">{comment.text}</p>
              <p className="text-xs text-[#9ca3af]">Customer: {comment.customer}</p>

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-5 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="p-3 bg-white rounded border-l-2 border-gray-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#111928]">{reply.author}</span>
                        <span className="text-xs text-[#9ca3af]">{reply.timestamp}</span>
                      </div>
                      <p className="text-sm text-[#111928]">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {replyingTo === comment.id && (
                <div className="mt-4 ml-5">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] mb-2"
                    placeholder="Type your reply..."
                  />
                  <div className="flex space-x-3">
                    <button
                      className="py-2 px-4 bg-[#5750f1] text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                      onClick={() => submitReply(comment.id)}
                    >
                      Submit Reply
                    </button>
                    <button
                      className="py-2 px-4 bg-gray-200 text-[#111928] rounded-lg hover:bg-gray-300 cursor-pointer"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!replyingTo && (
                <div className="mt-4 flex space-x-3">
                  <button
                    className="py-2 px-4 bg-gray-200 text-[#111928] rounded-lg hover:bg-gray-300 cursor-pointer"
                    onClick={() => handleReply(comment.id)}
                  >
                    Reply
                  </button>
                  <button
                    className="py-2 px-4 bg-gray-200 text-[#111928] rounded-lg hover:bg-gray-300 cursor-pointer"
                  >
                    View Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Comment Form */}
      <div className="bg-white p-6 rounded-lg border-[1px] border-[#e5e7eb]">
        <div className="mb-6">
          <h2 className="font-medium text-gray-800 text-[24px]">Quick Comment</h2>
          <p className="text-[18px] text-[#9ca3af]">Add a comment to any order</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <div>
            <label className="block text-sm font-medium text-[#111928] after:content-['*'] after:text-[#ef4444]">
              Order ID
            </label>
            <input
              type="text"
              value={selectedOrder}
              onChange={(e) => setSelectedOrder(e.target.value)}
              className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] mt-1"
              placeholder="ORD-001"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111928]">Comment Type</label>
            <div className="flex space-x-3 mt-2">
              <button
                className={`py-2 px-4 rounded-lg font-medium ${commentType === 'public' ? 'bg-[#5750f1] text-white' : 'bg-gray-200 text-[#111928] hover:bg-gray-300'}`}
                onClick={() => setCommentType('public')}
              >
                Public
              </button>
              <button
                className={`py-2 px-4 rounded-lg font-medium ${commentType === 'internal' ? 'bg-[#5750f1] text-white' : 'bg-gray-200 text-[#111928] hover:bg-gray-300'}`}
                onClick={() => setCommentType('internal')}
              >
                Internal
              </button>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#111928]">Comment</label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-4 py-3 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5750f1] mt-1"
            placeholder="Add your comment here..."
          />
        </div>
        <button
          className="bg-[#5750f1] text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center cursor-pointer"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
}

export default Comments;