import { motion } from 'framer-motion';
import { Users, Target, Eye, Calendar, MapPin, Phone, Mail, Award, Users2, Rocket, Diamond } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { Separator } from '@/components/ui/separator'; // Assuming you have a Separator component

// Custom container for section grouping
const SectionContainer = ({ children, className = '' }) => (
    <div className={`py-16 ${className}`} style={{ backgroundColor: 'var(--color-elementsBackground)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
        </div>
    </div>
);

export default function AboutUsPage() {
    const { companyInfo } = useStore();
    
    // Fallback data for demonstration if companyInfo is not fully loaded
    const fallbackCompanyInfo = {
        name: companyInfo?.companyName || 'ShopHub',
        description: companyInfo?.description || 'We are a leading e-commerce platform dedicated to providing the latest and greatest in high-performance computing and electronics. Our commitment is to quality, innovation, and exceptional customer service.',
        mission: companyInfo?.mission || 'To empower creators and professionals with cutting-edge technology solutions that drive productivity and innovation worldwide.',
        vision: companyInfo?.vision || 'To become the global leader in professional computing hardware, recognized for our commitment to quality, sustainability, and technological excellence.',
        story: companyInfo?.story || 'Founded in 2018 by a team of tech enthusiasts, our journey began with a simple goal: to make powerful computing accessible. From a small garage operation to a multi-national distributor, we have consistently upheld our values of transparency and customer focus. We believe in the power of technology to change the world.',
        values: companyInfo?.values || ['Innovation', 'Quality', 'Customer Focus', 'Integrity'],
        phone: companyInfo?.phone || '+1 (555) 123-4567',
        email: companyInfo?.email || 'support@shophub.com',
        location: companyInfo?.location || 'San Francisco, CA, USA',
        founded: companyInfo?.founded || '2018',
        employees: companyInfo?.employees || '150+',
    };

    const stats = [
        { label: 'Founded', value: fallbackCompanyInfo.founded, icon: <Calendar className="h-6 w-6" /> },
        { label: 'Team Members', value: fallbackCompanyInfo.employees, icon: <Users2 className="h-6 w-6" /> },
        { label: 'Global Locations', value: '3+', icon: <MapPin className="h-6 w-6" /> },
        { label: 'Products Sold', value: '1M+', icon: <Award className="h-6 w-6" /> },
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
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit-crop&crop=face',
            bio: 'Operations specialist ensuring smooth business processes.',
        },
    ];
    
    // Animation variants
    const fadeInUp = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.9] } },
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--color-Background)' }}>
            
            {/* 1. ELEVATED HERO SECTION (Matching Homepage Title Style) */}
            <motion.div
                initial="initial"
                animate="animate"
                variants={fadeInUp}
                className="pt-24 pb-16 bg-[var(--color-surface)] shadow-lg" // Added shadow and more padding
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div variants={fadeInUp}>
                        <h1 className="text-6xl font-extrabold mb-4 leading-tight">
                            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                                Discover Our Journey
                            </span>
                        </h1>
                    </motion.div>
                    <motion.div variants={fadeInUp} transition={{ delay: 0.1 }}>
                        <p className="text-xl text-[var(--color-text-secondary)] max-w-4xl mx-auto leading-relaxed mt-4">
                            {fallbackCompanyInfo.description}
                        </p>
                    </motion.div>
                </div>
            </motion.div>
            
            {/* 2. STATS SECTION - Clean Block */}
            <SectionContainer className="py-12">
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
                    className="grid md:grid-cols-4 gap-8"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                        >
                            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1" style={{ backgroundColor: 'var(--color-surface)' }}>
                                <CardContent className="p-0">
                                    <div className="text-[var(--color-primary)] mb-4 flex justify-center">
                                        {stat.icon}
                                    </div>
                                    <div className="text-4xl font-extrabold mb-1" style={{ color: 'var(--color-text)' }}>{stat.value}</div>
                                    <div className="text-lg font-medium text-[var(--color-text-secondary)]">{stat.label}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </SectionContainer>

            {/* 3. MISSION & VISION */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.3 }} className="text-center mb-12">
                    <h2 className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>Our Core Values</h2>
                    <Separator className="mt-4 w-24 mx-auto bg-[var(--color-primary)]" />
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    <motion.div variants={fadeInUp} transition={{ delay: 0.4 }}>
                        <Card className="h-full border-l-4 border-[var(--color-primary)] shadow-xl" style={{ backgroundColor: 'var(--color-surface)' }}>
                            <CardHeader>
                                <CardTitle className="flex items-center text-3xl font-semibold text-[var(--color-text)]">
                                    <Target className="h-7 w-7 mr-4 text-[var(--color-primary)]" />
                                    Our Mission
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-[var(--color-text-secondary)] leading-relaxed text-lg pt-2">
                                    {fallbackCompanyInfo.mission}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                    
                    <motion.div variants={fadeInUp} transition={{ delay: 0.5 }}>
                        <Card className="h-full border-l-4 border-[var(--color-secondary)] shadow-xl" style={{ backgroundColor: 'var(--color-surface)' }}>
                            <CardHeader>
                                <CardTitle className="flex items-center text-3xl font-semibold text-[var(--color-text)]">
                                    <Eye className="h-7 w-7 mr-4 text-[var(--color-secondary)]" />
                                    Our Vision
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-[var(--color-text-secondary)] leading-relaxed text-lg pt-2">
                                    {fallbackCompanyInfo.vision}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* 4. OUR STORY & VALUES */}
            <SectionContainer className="bg-[var(--color-Background)]">
                <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.6 }} className="text-center mb-12">
                    <h2 className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>Our Story and Core Principles</h2>
                    <Separator className="mt-4 w-24 mx-auto bg-[var(--color-secondary)]" />
                </motion.div>

                <motion.div variants={fadeInUp} transition={{ delay: 0.7 }} className="mb-12">
                    <Card className="shadow-2xl border-0 p-8" style={{ backgroundColor: 'var(--color-surface)' }}>
                        <CardContent className="p-0">
                            <p className="text-[var(--color-text)] leading-relaxed text-lg text-center max-w-4xl mx-auto">
                                {fallbackCompanyInfo.story}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
                
                {/* Values */}
                <motion.div variants={fadeInUp} transition={{ delay: 0.8 }}>
                    <h3 className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--color-text)' }}>Key Principles</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {fallbackCompanyInfo.values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * index + 0.8 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Badge 
                                    className="text-lg px-6 py-3 font-semibold border-2 bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                                    style={{ borderColor: 'var(--color-primary)' }}
                                >
                                    <Diamond className="h-4 w-4 mr-2" />
                                    {value}
                                </Badge>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </SectionContainer>
            
            {/* 5. TEAM SECTION - Grid with Image Focus */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.9 }} className="text-center mb-12">
                    <h2 className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>Meet Our Dedicated Team</h2>
                    <Separator className="mt-4 w-24 mx-auto bg-[var(--color-primary)]" />
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            transition={{ delay: 0.1 * index + 0.9 }}
                        >
                            <Card className="text-center overflow-hidden border-0 shadow-xl transition-all duration-300 hover:shadow-2xl" style={{ backgroundColor: 'var(--color-surface)' }}>
                                <div className="relative w-full aspect-[4/3] overflow-hidden"> 
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>{member.name}</h3>
                                    <p className="text-[var(--color-primary)] font-semibold mb-3">{member.role}</p>
                                    <p className="text-[var(--color-text-secondary)] text-sm">{member.bio}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
            
            {/* 6. CONTACT INFO BLOCK (Full Width, Gradient) */}
            <motion.div 
                initial="initial"
                animate="animate"
                variants={fadeInUp}
                transition={{ delay: 1.4 }}
            >
                <Card className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white border-0 rounded-none">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <CardHeader className='p-0 mb-8'>
                            <CardTitle className="text-4xl text-center font-extrabold">Ready to Connect?</CardTitle>
                        </CardHeader>
                        <CardContent className='p-0'>
                            <div className="grid md:grid-cols-3 gap-8 text-center">
                                <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                                    <Phone className="h-8 w-8 mb-4 text-white" />
                                    <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                                    <p className='text-lg'>{fallbackCompanyInfo.phone}</p>
                                </div>
                                
                                <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                                    <Mail className="h-8 w-8 mb-4 text-white" />
                                    <h3 className="text-xl font-semibold mb-2">Email</h3>
                                    <p className='text-lg'>{fallbackCompanyInfo.email}</p>
                                </div>
                                
                                <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur-sm">
                                    <MapPin className="h-8 w-8 mb-4 text-white" />
                                    <h3 className="text-xl font-semibold mb-2">Visit</h3>
                                    <p className='text-lg'>{fallbackCompanyInfo.location}</p>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </motion.div>

            {/* 7. COMPANY MAP LOCATION */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 1.5 }}
                >
                    <Card className="border-0 shadow-2xl overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
                        <CardHeader className="pt-6">
                            <CardTitle className="text-3xl text-center flex items-center justify-center gap-3">
                                <MapPin className="h-7 w-7 text-[var(--color-primary)]" />
                                Find Us Here
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-0">
                            <div className="w-full h-[450px]">
                                {/* Corrected Map URL Structure */}
                                <iframe
                                    title="Company Location"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                        fallbackCompanyInfo.location
                                    )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
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