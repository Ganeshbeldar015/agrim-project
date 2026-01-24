import React, { useState } from 'react';
import { Check, X, FileText, Eye } from 'lucide-react';

const SellerApprovals = () => {
    // Mock Data for pending requests
    const [requests, setRequests] = useState([
        { id: 1, name: 'Tech World inc.', owner: 'John Doe', email: 'john@techworld.com', date: '2023-10-24', status: 'Pending', doc: 'Business_License.pdf' },
        { id: 2, name: 'Green Organic Farm', owner: 'Sarah Smith', email: 'sarah@organics.com', date: '2023-10-25', status: 'Pending', doc: 'Cert.pdf' },
        { id: 3, name: 'Urban Threads', owner: 'Mike Ross', email: 'mike@urban.com', date: '2023-10-23', status: 'Pending', doc: 'Tax_ID.pdf' },
    ]);

    const handleAction = (id, action) => {
        if (window.confirm(`Are you sure you want to ${action} this request?`)) {
            setRequests(requests.filter(req => req.id !== id));
            alert(`Request ${action}ed successfully.`);
        }
    };

    return (
        <div className="space-y-6">
             <div>
                <h1 className="text-2xl font-bold text-gray-800">Franchise Requests</h1>
                <p className="text-sm text-gray-500">Review and approve new seller applications.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Shop Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submission Date</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documents</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {requests.length > 0 ? requests.map((req) => (
                            <tr key={req.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{req.name}</div>
                                    <div className="text-xs text-gray-500">{req.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{req.owner}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{req.date}</td>
                                <td className="px-6 py-4">
                                    <button className="flex items-center gap-1 text-primary-600 hover:underline text-sm">
                                        <FileText className="w-4 h-4" />
                                        {req.doc}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button 
                                        onClick={() => handleAction(req.id, 'Approve')}
                                        className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm font-medium"
                                    >
                                        <Check className="w-4 h-4 mr-1" /> Approve
                                    </button>
                                    <button 
                                        onClick={() => handleAction(req.id, 'Reject')}
                                        className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                    >
                                        <X className="w-4 h-4 mr-1" /> Reject
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                    No pending requests found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerApprovals;
