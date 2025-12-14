import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, Mail, User, Clock, Reply, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useStore } from '@/lib/store';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export default function MessagesPage() {
  const { currentUser, addNotification } = useStore();
  const isAdmin = currentUser?.isAdmin;
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Question about product availability',
      message: 'Hi, I wanted to ask about the wireless headphones. Are they still in stock?',
      date: '2024-01-15',
      isRead: false,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      subject: 'Shipping inquiry',
      message: 'Hello, I placed an order yesterday. When can I expect it to arrive?',
      date: '2024-01-14',
      isRead: true,
    },
  ]);
  
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (contactForm.name && contactForm.email && contactForm.subject && contactForm.message) {
      const newMessage: Message = {
        id: Date.now().toString(),
        name: contactForm.name,
        email: contactForm.email,
        subject: contactForm.subject,
        message: contactForm.message,
        date: new Date().toISOString().split('T')[0],
        isRead: false,
      };
      
      setMessages(prev => [newMessage, ...prev]);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      addNotification('Message sent successfully!', 'success');
    }
  };
  
  const markAsRead = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, isRead: true } : msg
    ));
  };
  
  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
    addNotification('Message deleted', 'info');
  };
  
  const unreadCount = messages.filter(msg => !msg.isRead).length;
  
  return (
    <div className="min-h-screen bg-[var(--color-Background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            {isAdmin ? 'Customer Messages' : 'Contact Us'}
          </h1>
          <p className="text-gray-600">
            {isAdmin 
              ? `Manage customer inquiries (${unreadCount} unread)`
              : 'Send us a message and we\'ll get back to you soon'
            }
          </p>
        </motion.div>
        
        {!isAdmin ? (
          // Contact Form for Customers
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-6 w-6 mr-2" />
                  Send Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitMessage} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Your Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="What is this about?"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Type your message here..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          // Admin Message Management
          <div className="space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
                <p className="text-gray-600">Customer messages will appear here</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`cursor-pointer transition-all hover:shadow-lg ${
                      !message.isRead ? 'border-blue-500 bg-blue-50/50' : ''
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="font-semibold">{message.name}</span>
                              <span className="text-gray-500">({message.email})</span>
                              {!message.isRead && (
                                <Badge variant="destructive" className="text-xs">New</Badge>
                              )}
                            </div>
                            
                            <h3 className="font-semibold text-lg mb-2">{message.subject}</h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">{message.message}</p>
                            
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {message.date}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedMessage(message);
                                    markAsRead(message.id);
                                  }}
                                  className='hover:bg-[var(--color-primary)] hover:text-white'
                                >
                                  <Reply className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl bg-[var(--color-surface)]">
                                <DialogHeader>
                                  <DialogTitle>Message from {message.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label>From</Label>
                                    <p>{message.name} ({message.email})</p>
                                  </div>
                                  <div>
                                    <Label>Subject</Label>
                                    <p>{message.subject}</p>
                                  </div>
                                  <div>
                                    <Label>Message</Label>
                                    <p className="bg-[var(--color-Background)] p-4 rounded-lg">{message.message}</p>
                                  </div>
                                  <div>
                                    <Label>Date</Label>
                                    <p>{message.date}</p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteMessage(message.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}