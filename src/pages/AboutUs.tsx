import { motion } from 'framer-motion';
import { Users, Target, Eye, Calendar, MapPin, Phone, Mail, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';

export default function AboutUsPage() {
  const { companyInfo } = useStore();
  
  const stats = [
    { label: 'Founded', value: companyInfo.founded, icon: <Calendar className="h-6 w-6" /> },
    { label: 'Employees', value: companyInfo.employees, icon: <Users className="h-6 w-6" /> },
    { label: 'Location', value: companyInfo.location, icon: <MapPin className="h-6 w-6" /> },
    { label: 'Awards', value: '25+', icon: <Award className="h-6 w-6" /> },
  ];
  
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      bio: 'Visionary leader with 15+ years in e-commerce and technology.',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: 'Tech expert passionate about creating seamless user experiences.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Marketing',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Creative strategist driving brand growth and customer engagement.',
    },
    {
      name: 'David Kim',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'Operations specialist ensuring smooth business processes.',
    },
  ];
  
  return (
    <div className="min-h-screen bg-[var(--color-Background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
            About {companyInfo.name}
          </h1>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
            {companyInfo.description}
          </p>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="text-[var(--color-primary)] mb-4 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-[var(--color-text-secondary)]">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Mission & Vision */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Target className="h-6 w-6 mr-3 text-[var(--color-primary)]" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--color-text-secondary)] leading-relaxed text-lg">
                  {companyInfo.mission}
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Eye className="h-6 w-6 mr-3 text-[var(--color-primary)]" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--color-text-secondary)] leading-relaxed text-lg">
                  {companyInfo.vision}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl text-center">Our Story</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-lg text-center max-w-4xl mx-auto">
                {companyInfo.story}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {companyInfo.values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge variant="secondary" className="text-lg px-6 py-3  text-[var(--color-secondary)] border-2 border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  {value}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <Card className="text-center overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <p className="text-[var(--color-primary)] font-medium mb-3">{member.role}</p>
                    <p className="text-[var(--color-text-secondary)] text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white border-0">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Get In Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <Phone className="h-8 w-8 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Phone</h3>
                  <p>{companyInfo.phone}</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <Mail className="h-8 w-8 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Email</h3>
                  <p>{companyInfo.email}</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <MapPin className="h-8 w-8 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Location</h3>
                  <p>{companyInfo.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

          {/* Company Map Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-16"
        >
          <Card className="border-0 shadow-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-3xl text-center flex items-center justify-center gap-3">
                <MapPin className="h-7 w-7 text-[var(--color-primary)]" />
                Our Location on Map
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="w-full h-[450px]">
                <iframe
                  title="Company Location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    companyInfo.location
                  )}&output=embed`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}