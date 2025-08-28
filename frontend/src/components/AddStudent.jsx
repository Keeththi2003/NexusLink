import React, {useContext, useState } from 'react';
import { db, storage } from '../firebase';
import { ref as dbRef, set, push } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import CreatableSelect from 'react-select/creatable';
import { FaUser, FaCalendarAlt, FaUniversity, FaGraduationCap, FaAddressCard, FaIdCard, FaFileUpload, FaCheckCircle, FaTools, FaPhone, FaEnvelope, FaVenusMars, FaLinkedin } from 'react-icons/fa';
import { MdWork, MdSchool } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const AddStudent = () => {
    const initialState = {
        fullName: '', dateOfBirth: '', sex: 'Male', phoneNo: '', email: '',
        universityEmail: '', linkedin: '', university: '', degree: '',
        status: 'Intern', address: '', nicNo: '', skills: [],
    };
    const [formData, setFormData] = useState(initialState);
    const [files, setFiles] = useState({
        passportPhoto: null,
        nicCopy: null,
        universityIdCopy: null,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const { currentUser } = useAuth();
    const { isDarkMode } = useTheme();
    const universities = ["University of Moratuwa", "University of Colombo", "University of Peradeniya", "SLIIT", "NSBM", "Other"];
    const degrees = ["BSc in Computer Science", "BEng in Software Engineering", "BSc in Information Technology", "BBA in Business Administration", "Other"];
    const skillOptions = [
        { value: 'JavaScript', label: 'JavaScript' }, { value: 'React', label: 'React' },
        { value: 'Node.js', label: 'Node.js' }, { value: 'Python', label: 'Python' },
        { value: 'Java', label: 'Java' }, { value: 'Spring Boot', label: 'Spring Boot' },
        { value: 'SQL', label: 'SQL' }, { value: 'NoSQL', label: 'NoSQL' },
        { value: 'Docker', label: 'Docker' }, { value: 'AWS', label: 'AWS' },
    ];

    const validateField = (name, value) => {
        let errorMsg = '';
        const requiredFields = ['fullName', 'dateOfBirth', 'phoneNo', 'email', 'university', 'degree', 'address', 'nicNo'];
        
        if (requiredFields.includes(name) && typeof value === 'string' && !value.trim()) {
            errorMsg = 'This field is required.';
        } else if ((name === 'email' || name === 'universityEmail') && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errorMsg = 'Invalid email format.';
        } else if (name === 'phoneNo' && value && !/^\+?[0-9]{9,12}$/.test(value.replace(/\s/g, ''))) {
            errorMsg = 'Please enter a valid phone number (9-12 digits).';
        } else if (name === 'nicNo' && value && !/^\d{12}$|^\d{9}[vVxX]$/.test(value)) {
            errorMsg = 'Please enter a valid 12-digit or 9-digit + V/X NIC.';
        } else if (name === 'linkedin' && value && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(value)) {
            errorMsg = 'Please enter a valid LinkedIn profile URL.';
        } else if (name === 'skills' && Array.isArray(value) && value.length === 0) {
            errorMsg = 'Please add at least one skill.';
        }
        
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
        return errorMsg === '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleSkillsChange = (selectedOptions) => {
        const skills = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFormData(prev => ({ ...prev, skills }));
        validateField('skills', skills);
    };

    const handleFileChange = (e) => {
        const { name, files: inputFiles } = e.target;
        if (inputFiles.length > 0) {
            setFiles(prev => ({ ...prev, [name]: inputFiles[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Run validation on all fields before submitting and collect errors
        let isFormValid = true;
        Object.keys(formData).forEach(key => {
            if (!validateField(key, formData[key])) {
                isFormValid = false;
            }
        });

        if (!files.passportPhoto) {
            isFormValid = false;
        }

        if (!isFormValid) {
            alert('Please fix all errors and upload a passport photo before submitting.');
            return;
        }

        setLoading(true);
        setSubmitMessage('');

        try {
            // Upload passport photo
            const photoRef = storageRef(storage, `passport-photos/${uuidv4()}_${files.passportPhoto.name}`);
            const photoSnapshot = await uploadBytes(photoRef, files.passportPhoto);
            const photoURL = await getDownloadURL(photoSnapshot.ref);

            // Upload other files if provided
            let nicURL = '';
            let universityIdURL = '';

            if (files.nicCopy) {
                const nicRef = storageRef(storage, `nic-copies/${uuidv4()}_${files.nicCopy.name}`);
                const nicSnapshot = await uploadBytes(nicRef, files.nicCopy);
                nicURL = await getDownloadURL(nicSnapshot.ref);
            }

            if (files.universityIdCopy) {
                const uniRef = storageRef(storage, `university-ids/${uuidv4()}_${files.universityIdCopy.name}`);
                const uniSnapshot = await uploadBytes(uniRef, files.universityIdCopy);
                universityIdURL = await getDownloadURL(uniSnapshot.ref);
            }

            // Prepare student data
            const studentData = {
                ...formData,
                photoURL,
                nicURL,
                universityIdURL,
                userId: currentUser.uid,
                timestamp: Date.now(),
            };

            // Save to database
            const newStudentRef = push(dbRef(db, 'students'));
            await set(newStudentRef, studentData);

            setSubmitMessage('Student profile created successfully!');
            setFormData(initialState);
            setFiles({ passportPhoto: null, nicCopy: null, universityIdCopy: null });
            setErrors({});

        } catch (error) {
            console.error('Error creating student profile:', error);
            setSubmitMessage('Error creating student profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-secondary-800/80 backdrop-blur-sm">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center mb-4">
                            <FaUser className="text-white text-2xl" />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                            Add Student Profile
                        </CardTitle>
                        <CardDescription className="text-lg text-secondary-600 dark:text-secondary-400">
                            Create your professional profile to connect with opportunities
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white flex items-center">
                                    <FaUser className="mr-2 text-primary-600" />
                                    Personal Information
                                </h3>
                                
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            Full Name *
                                        </label>
                                        <Input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            className={errors.fullName ? 'border-red-500' : ''}
                                        />
                                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            Date of Birth *
                                        </label>
                                        <Input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                            className={errors.dateOfBirth ? 'border-red-500' : ''}
                                        />
                                        {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            Sex
                                        </label>
                                        <Select
                                            name="sex"
                                            value={formData.sex}
                                            onChange={handleInputChange}
                                            className="w-full"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            Phone Number *
                                        </label>
                                        <Input
                                            type="tel"
                                            name="phoneNo"
                                            value={formData.phoneNo}
                                            onChange={handleInputChange}
                                            placeholder="+94 71 234 5678"
                                            className={errors.phoneNo ? 'border-red-500' : ''}
                                        />
                                        {errors.phoneNo && <p className="text-red-500 text-sm mt-1">{errors.phoneNo}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white flex items-center">
                                    <FaEnvelope className="mr-2 text-primary-600" />
                                    Contact Information
                                </h3>
                                
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            Email *
                                        </label>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="your.email@example.com"
                                            className={errors.email ? 'border-red-500' : ''}
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            University Email
                                        </label>
                                        <Input
                                            type="email"
                                            name="universityEmail"
                                            value={formData.universityEmail}
                                            onChange={handleInputChange}
                                            placeholder="student@university.edu"
                                            className={errors.universityEmail ? 'border-red-500' : ''}
                                        />
                                        {errors.universityEmail && <p className="text-red-500 text-sm mt-1">{errors.universityEmail}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            LinkedIn Profile
                                        </label>
                                        <Input
                                            type="url"
                                            name="linkedin"
                                            value={formData.linkedin}
                                            onChange={handleInputChange}
                                            placeholder="https://linkedin.com/in/yourprofile"
                                            className={errors.linkedin ? 'border-red-500' : ''}
                                        />
                                        {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white flex items-center">
                                    <FaUniversity className="mr-2 text-primary-600" />
                                    Academic Information
                                </h3>
                                
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            University *
                                        </label>
                                        <Select
                                            name="university"
                                            value={formData.university}
                                            onChange={handleInputChange}
                                            className="w-full"
                                        >
                                            <option value="">Select University</option>
                                            {universities.map(uni => (
                                                <option key={uni} value={uni}>{uni}</option>
                                            ))}
                                        </Select>
                                        {errors.university && <p className="text-red-500 text-sm mt-1">{errors.university}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            Degree *
                                        </label>
                                        <Select
                                            name="degree"
                                            value={formData.degree}
                                            onChange={handleInputChange}
                                            className="w-full"
                                        >
                                            <option value="">Select Degree</option>
                                            {degrees.map(deg => (
                                                <option key={deg} value={deg}>{deg}</option>
                                            ))}
                                        </Select>
                                        {errors.degree && <p className="text-red-500 text-sm mt-1">{errors.degree}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            Current Status
                                        </label>
                                        <Select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full"
                                        >
                                            <option value="Intern">Intern</option>
                                            <option value="Student">Student</option>
                                            <option value="Graduate">Graduate</option>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white flex items-center">
                                    <FaTools className="mr-2 text-primary-600" />
                                    Skills
                                </h3>
                                
                                <div>
                                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                        Technical Skills *
                                    </label>
                                    <CreatableSelect
                                        isMulti
                                        options={skillOptions}
                                        value={skillOptions.filter(option => formData.skills.includes(option.value))}
                                        onChange={handleSkillsChange}
                                        placeholder="Select or create skills..."
                                        className={errors.skills ? 'border-red-500' : ''}
                                        styles={{
                                            control: (provided, state) => ({
                                                ...provided,
                                                borderColor: errors.skills ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
                                                '&:hover': {
                                                    borderColor: errors.skills ? '#ef4444' : '#9ca3af'
                                                }
                                            })
                                        }}
                                    />
                                    {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                                </div>
                            </div>

                            {/* Address and ID */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white flex items-center">
                                    <FaAddressCard className="mr-2 text-primary-600" />
                                    Address & Identification
                                </h3>
                                
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            Address *
                                        </label>
                                        <Textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full address"
                                            rows={3}
                                            className={errors.address ? 'border-red-500' : ''}
                                        />
                                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            NIC Number *
                                        </label>
                                        <Input
                                            type="text"
                                            name="nicNo"
                                            value={formData.nicNo}
                                            onChange={handleInputChange}
                                            placeholder="123456789V or 123456789012"
                                            className={errors.nicNo ? 'border-red-500' : ''}
                                        />
                                        {errors.nicNo && <p className="text-red-500 text-sm mt-1">{errors.nicNo}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* File Uploads */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white flex items-center">
                                    <FaFileUpload className="mr-2 text-primary-600" />
                                    Document Uploads
                                </h3>
                                
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            Passport Photo *
                                        </label>
                                        <Input
                                            type="file"
                                            name="passportPhoto"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required
                                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/20 dark:file:text-primary-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            NIC Copy
                                        </label>
                                        <Input
                                            type="file"
                                            name="nicCopy"
                                            onChange={handleFileChange}
                                            accept="image/*,.pdf"
                                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary-50 file:text-secondary-700 hover:file:bg-secondary-100 dark:file:bg-secondary-900/20 dark:file:text-secondary-300"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                                            University ID Copy
                                        </label>
                                        <Input
                                            type="file"
                                            name="universityIdCopy"
                                            onChange={handleFileChange}
                                            accept="image/*,.pdf"
                                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary-50 file:text-secondary-700 hover:file:bg-secondary-100 dark:file:bg-secondary-900/20 dark:file:text-secondary-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto px-8 py-3 text-lg font-medium bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    {loading ? (
                                        <div className="flex items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Creating Profile...
                                        </div>
                                    ) : (
                                        <div className="flex items-center">
                                            <FaCheckCircle className="mr-2" />
                                            Create Profile
                                        </div>
                                    )}
                                </Button>
                            </div>

                            {/* Success/Error Message */}
                            {submitMessage && (
                                <div className={`text-center p-4 rounded-lg ${
                                    submitMessage.includes('successfully') 
                                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                                }`}>
                                    {submitMessage}
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddStudent;