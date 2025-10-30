import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  EyeIcon,
  EyeOff,
  FileText,
  Folder,
  GraduationCap,
  Share2Icon,
  Sparkles,
  User,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";

const ResumeBuilder = () => {
  const { resumeId } = useParams();

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: Folder },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: "",
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3b82f6",
    public: false,
  });

  // Load resume data based on the URL param
  const loadExistingResume = async () => {
    const resume = dummyResumeData.find((resume) => resume._id === resumeId);
    if (resume) {
      setResumeData(resume);
      document.title = resume.title;
    }
  };

  const changeResumeVisibility = async () => {
    setResumeData({ ...resumeData, public: !resumeData.public });
  };

  const handleShare = () => {
    const frontEndUrl = window.location.href.split("/app/")[0];
    const resumeUrl = frontEndUrl + "/view/" + resumeId;

    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume" });
    } else {
      alert("Share not supported on this browser");
    }
  };

  const downloadResume = () => {
    window.print();
  };

  useEffect(() => {
    loadExistingResume();
  }, []);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header / Back to Dashboard */}
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link
          to='/app'
          className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className='size-4' />
          Back to Dashboard
        </Link>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-2 gap-8'>
          {/* LEFT PANEL — Form */}
          <div className='relative bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
            {/* Progress bar background */}
            <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />

            {/* Progress bar foreground */}
            <hr
              className='absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-500'
              style={{
                width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
              }}
            />

            {/* Navigation */}
            <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
              <div className=' flex items-center gap-2'>
                <TemplateSelector
                  selectedTemplate={resumeData.template}
                  onChange={(template) =>
                    setResumeData((prev) => ({ ...prev, template }))
                  }
                />
                <ColorPicker
                  selectedColor={resumeData.accent_color}
                  onChange={(color) =>
                    setResumeData((prev) => ({
                      ...prev,
                      accent_color: color,
                    }))
                  }
                />
              </div>

              <div className='flex items-center'>
                {activeSectionIndex > 0 && (
                  <button
                    onClick={() =>
                      setActiveSectionIndex((prev) => Math.max(prev - 1, 0))
                    }
                    className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all'>
                    <ChevronLeft className='size-4' />
                    Previous
                  </button>
                )}

                {activeSectionIndex < sections.length - 1 && (
                  <button
                    onClick={() =>
                      setActiveSectionIndex((prev) =>
                        Math.min(prev + 1, sections.length - 1)
                      )
                    }
                    className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all'>
                    Next
                    <ChevronRight className='size-4' />
                  </button>
                )}
              </div>
            </div>

            {/* Personal information section */}
            <div className='space-y-6'>
              {activeSection.id === "personal" && (
                <PersonalInfoForm
                  data={resumeData.personal_info}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      personal_info: data,
                    }))
                  }
                  removeBackground={removeBackground}
                  setRemoveBackground={setRemoveBackground}
                />
              )}

              {/* Profesional Summary section */}
              {activeSection.id === "summary" && (
                <ProfessionalSummaryForm
                  data={resumeData.professional_summary}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      professional_summary: data,
                    }))
                  }
                  setResumeData={setResumeData}
                />
              )}

              {/* Experience section */}
              {activeSection.id === "experience" && (
                <ExperienceForm
                  data={resumeData.experience}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      experience: data,
                    }))
                  }
                />
              )}

              {/* Education Section */}
              {activeSection.id === "education" && (
                <EducationForm
                  data={resumeData.education}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      education: data,
                    }))
                  }
                />
              )}

              {/* Project Section */}
              {activeSection.id === "projects" && (
                <ProjectForm
                  data={resumeData.project}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      project: data,
                    }))
                  }
                />
              )}

              {/* Skills section */}
              {activeSection.id === "skills" && (
                <SkillsForm
                  data={resumeData.skills}
                  onChange={(data) =>
                    setResumeData((prev) => ({
                      ...prev,
                      skills: data,
                    }))
                  }
                />
              )}
            </div>

            {/* Save Changes button */}
            <button className=' bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 rounded-md transition-all px-6 py-2 text-sm mt-6'>
              Save Changes
            </button>
          </div>

          {/* RIGHT PANEL — Resume Preview */}
          <div className=' lg:col-span-7 max-lg:mt-6'>
            {/* Buttons Panel */}
            <div className=' relative w-full'>
              <div className=' absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                {resumeData.public && (
                  // Share Button
                  <button
                    onClick={handleShare}
                    className=' flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                    <Share2Icon className=' size-4' /> Share
                  </button>
                )}

                {/* Visibility button */}
                <button
                  onClick={changeResumeVisibility}
                  className=' flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors'>
                  {resumeData.public ? (
                    <EyeIcon className=' size-4' />
                  ) : (
                    <EyeOff className=' size-4' />
                  )}
                  {resumeData.public ? "Public" : "Private"}
                </button>

                {/* Download button */}
                <button
                  onClick={downloadResume}
                  className=' flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors'>
                  <Download className=' size-4' /> Download
                </button>
              </div>
            </div>

            {/* Resume preview */}
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
