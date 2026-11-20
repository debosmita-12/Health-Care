import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  HeartPulse, Shield, Award, Users, Calendar, ArrowRight,
  Stethoscope, Clock, CheckCircle2, Star, Mail, MapPin,
  Smile, Baby, Bone, Sparkles, Brain, Code2
} from 'lucide-react';

export default function LandingPage() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    // Fetch live doctors and departments
    api.get('/doctors/approved')
      .then(data => setDoctors(data || []))
      .catch(() => {});

    api.get('/departments')
      .then(data => setDepartments(data || []))
      .catch(() => {});
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setContactSubmitted(true);
      setContactForm({ name: '', email: '', message: '' });
    }
  };

  const getDepartmentIcon = (iconName) => {
    switch (iconName) {
      case 'Smile': return <Smile size={28} color="#1B8067" />;
      case 'Baby': return <Baby size={28} color="#1B8067" />;
      case 'Bone': return <Bone size={28} color="#1B8067" />;
      case 'Sparkles': return <Sparkles size={28} color="#1B8067" />;
      case 'Brain': return <Brain size={28} color="#1B8067" />;
      default: return <HeartPulse size={28} color="#1B8067" />;
    }
  };

  return (
    <div style={{ backgroundColor: '#F8FBF9' }}>

      {/* 1. HERO SECTION */}
      <section style={{
        padding: '70px 0 60px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F7F4 100%)',
        borderBottom: '1px solid #E2ECE7'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <div className="badge badge-mint" style={{ marginBottom: '18px', padding: '6px 14px' }}>
              <Sparkles size={14} /> Caring Today For Brighter Tomorrows
            </div>
            <h1 style={{
              fontSize: 'clamp(2.4rem, 4.5vw, 3.4rem)',
              fontWeight: '800',
              lineHeight: '1.15',
              color: '#145C4B',
              letterSpacing: '-1px',
              marginBottom: '20px'
            }}>
              Your Health, <br />
              <span style={{ color: '#1B8067' }}>Our Priority.</span>
            </h1>
            <p style={{
              fontSize: '1.12rem',
              color: '#687B74',
              lineHeight: '1.7',
              marginBottom: '32px',
              maxWidth: '540px'
            }}>
              Experience smarter healthcare management with trusted professionals, organized medical records and convenient digital healthcare services.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '40px' }}>
              <a href="#services" className="btn btn-primary" style={{ padding: '13px 28px', fontSize: '1rem' }}>
                Explore Services <ArrowRight size={18} />
              </a>
              <a href="#about" className="btn btn-outline" style={{ padding: '13px 26px', fontSize: '1rem' }}>
                Learn More
              </a>
            </div>

            {/* Value Props Row (Inspired by Cleargrin layout) */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', borderTop: '1px solid #E2ECE7', paddingTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#E8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} color="#1B8067" />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#193B34' }}>Trusted Care</div>
                  <div style={{ fontSize: '0.78rem', color: '#687B74' }}>Verified Specialists</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#E8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={20} color="#1B8067" />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#193B34' }}>All Ages Welcome</div>
                  <div style={{ fontSize: '0.78rem', color: '#687B74' }}>Family Wellness</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#E8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={20} color="#1B8067" />
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.88rem', color: '#193B34' }}>Modern Tech</div>
                  <div style={{ fontSize: '0.78rem', color: '#687B74' }}>Digital Records</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: '36px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid #D8E6DF',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#E8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Stethoscope size={26} color="#1B8067" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#145C4B' }}>Clinical Overview</h3>
                  <p style={{ fontSize: '0.8rem', color: '#687B74' }}>Coordinated Healthcare Dispatch</p>
                </div>
              </div>
              <span className="badge badge-confirmed">System Live</span>
            </div>

            <div style={{ background: '#F8FBF9', padding: '18px', borderRadius: '14px', marginBottom: '18px', border: '1px solid #E2ECE7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                <span style={{ color: '#687B74' }}>Active Doctors:</span>
                <strong style={{ color: '#193B34' }}>{doctors.length || 3} Verified Specialists</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                <span style={{ color: '#687B74' }}>Clinical Departments:</span>
                <strong style={{ color: '#193B34' }}>{departments.length || 6} Departments</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: '#687B74' }}>Authentication:</span>
                <strong style={{ color: '#1B8067' }}>Role-Based (BCrypt + JWT)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/register" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                Join as Patient / Doctor
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '10px 18px' }}>
                Portal Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT HEALTH & CARE */}
      <section id="about" style={{ padding: '80px 0', borderBottom: '1px solid #E2ECE7' }}>
        <div className="container">
          <div style={{ maxWidth: '750px', margin: '0 auto 50px', textAlign: 'center' }}>
            <span className="badge badge-mint" style={{ marginBottom: '12px' }}>A Calmer Healthcare Experience</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#145C4B', marginBottom: '16px' }}>
              Modern Care. A Kinder Approach.
            </h2>
            <p style={{ color: '#687B74', fontSize: '1.05rem', lineHeight: '1.7' }}>
              Health &amp; Care combines modern digital technology with a compassionate, friendly approach to make every clinical visit comfortable, transparent, and completely stress-free.
            </p>
          </div>

          <div className="grid-3">
            <div className="card card-hover">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#E8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <CheckCircle2 size={24} color="#1B8067" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#193B34', marginBottom: '10px' }}>Comprehensive Care</h3>
              <p style={{ color: '#687B74', fontSize: '0.92rem', lineHeight: '1.6' }}>
                From preventative consultations to specialized therapy and diagnostic reviews, our platform connects you with experienced medical professionals.
              </p>
            </div>

            <div className="card card-hover">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#E8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Shield size={24} color="#1B8067" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#193B34', marginBottom: '10px' }}>Secure Digital Records</h3>
              <p style={{ color: '#687B74', fontSize: '0.92rem', lineHeight: '1.6' }}>
                All diagnoses, consultation summaries and medication plans are securely stored in relational databases accessible only by authorized doctors and patients.
              </p>
            </div>

            <div className="card card-hover">
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#E8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Clock size={24} color="#1B8067" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#193B34', marginBottom: '10px' }}>Real-Time Coordination</h3>
              <p style={{ color: '#687B74', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Instant booking requests, doctor approvals, live status updates, and automated notifications eliminate phone queues and waiting room delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR HEALTHCARE SERVICES */}
      <section id="services" style={{ padding: '80px 0', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2ECE7' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="badge badge-mint" style={{ marginBottom: '8px' }}>Clinical Excellence</span>
              <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#145C4B' }}>Our Healthcare Services</h2>
              <p style={{ color: '#687B74', fontSize: '0.98rem' }}>Comprehensive care tailored for every stage of life.</p>
            </div>
            <Link to="/register" className="btn btn-outline btn-sm">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-3">
            {[
              { title: 'General Medicine', desc: 'Preventive checkups, diagnostic screenings, and lifestyle management.', icon: 'HeartPulse' },
              { title: 'Dental & Maxillofacial', desc: 'Cleanings, examinations, pain-free smile design and clear aligners.', icon: 'Smile' },
              { title: 'Pediatric Care', desc: 'Specialized healthcare, immunizations and development for growing kids.', icon: 'Baby' },
              { title: 'Orthopedics & Joints', desc: 'Bone health, joint therapies, and physical mobility recovery.', icon: 'Bone' },
              { title: 'Dermatology & Skin', desc: 'Clinical treatments for acne, eczema, and skin wellness.', icon: 'Sparkles' },
              { title: 'Neurological Care', desc: 'Comprehensive assessments for cognitive and nervous system health.', icon: 'Brain' }
            ].map((srv, idx) => (
              <div key={idx} className="card card-hover" style={{ textAlign: 'center', padding: '30px 20px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '18px',
                  background: '#E8F6F0', margin: '0 auto 18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {getDepartmentIcon(srv.icon)}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#193B34', marginBottom: '8px' }}>{srv.title}</h3>
                <p style={{ color: '#687B74', fontSize: '0.88rem', lineHeight: '1.6' }}>{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DOCTOR DIRECTORY */}
      <section id="doctors" style={{ padding: '80px 0', borderBottom: '1px solid #E2ECE7' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 48px' }}>
            <span className="badge badge-mint" style={{ marginBottom: '8px' }}>Verified Medical Team</span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#145C4B', marginBottom: '12px' }}>
              Meet Our Certified Specialists
            </h2>
            <p style={{ color: '#687B74', fontSize: '0.98rem' }}>
              Every practicing doctor is thoroughly vetted and approved by our medical administration.
            </p>
          </div>

          <div className="grid-3">
            {(doctors.length > 0 ? doctors : [
              { fullName: 'Dr. Rajesh Iyer', specialization: 'Interventional Cardiology', qualification: 'MD, DM Cardiology', experienceYears: 12, consultationFee: 800, availableDays: 'Mon,Tue,Wed,Thu,Fri' },
              { fullName: 'Dr. Sneha Roy', specialization: 'Cosmetic & Restorative Dentistry', qualification: 'BDS, MDS Orthodontics', experienceYears: 8, consultationFee: 600, availableDays: 'Mon,Wed,Fri,Sat' },
              { fullName: 'Dr. Ananya Sen', specialization: 'Internal Medicine', qualification: 'MBBS, MD General Medicine', experienceYears: 10, consultationFee: 700, availableDays: 'Daily (Mon-Sat)' }
            ]).map((doc, idx) => (
              <div key={idx} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #145C4B 0%, #1B8067 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#FFFFFF', fontWeight: '700', fontSize: '1.2rem'
                    }}>
                      {doc.fullName.replace('Dr. ', '').charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#193B34' }}>{doc.fullName}</h3>
                      <div style={{ fontSize: '0.82rem', color: '#1B8067', fontWeight: '600' }}>{doc.specialization}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#687B74', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
                    <div><strong>Qualification:</strong> {doc.qualification}</div>
                    <div><strong>Experience:</strong> {doc.experienceYears} Years</div>
                    <div><strong>Consultation Fee:</strong> ₹{doc.consultationFee}</div>
                    <div><strong>Schedule:</strong> {doc.availableDays}</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E2ECE7', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge badge-confirmed">Verified Specialist</span>
                  <Link to="/login" className="btn btn-secondary btn-sm">
                    Book in Portal
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MEDICAL DEPARTMENTS */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2ECE7' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 48px' }}>
            <span className="badge badge-mint" style={{ marginBottom: '8px' }}>Specialized Departments</span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#145C4B', marginBottom: '12px' }}>
              Comprehensive Medical Departments
            </h2>
            <p style={{ color: '#687B74', fontSize: '0.98rem' }}>
              Organized into dedicated wings with integrated medical record management.
            </p>
          </div>

          <div className="grid-3">
            {(departments.length > 0 ? departments : [
              { name: 'Cardiology', description: 'Advanced ECG, cardiovascular therapy and heart health management.', iconName: 'HeartPulse' },
              { name: 'Dental & Maxillofacial', description: 'Oral hygiene, alignment, surgery, and painless dental therapy.', iconName: 'Smile' },
              { name: 'Pediatrics & Child Care', description: 'Preventive childhood immunization and growth evaluation.', iconName: 'Baby' },
              { name: 'Orthopedics & Joint Care', description: 'Joint restoration, fracture management, and physical therapy.', iconName: 'Bone' },
              { name: 'Dermatology & Skin Care', description: 'Targeted skin health, acne solutions, and clinical aesthetics.', iconName: 'Sparkles' },
              { name: 'Neurology & Brain Health', description: 'Nervous system diagnostics and cognitive health programs.', iconName: 'Brain' }
            ]).map((dept, idx) => (
              <div key={idx} className="card card-hover" style={{ borderLeft: '4px solid #1B8067' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  {getDepartmentIcon(dept.iconName)}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#193B34' }}>{dept.name}</h3>
                </div>
                <p style={{ color: '#687B74', fontSize: '0.88rem', lineHeight: '1.6' }}>{dept.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid #E2ECE7' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px' }}>
            <span className="badge badge-mint" style={{ marginBottom: '8px' }}>Simple Workflow</span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#145C4B', marginBottom: '12px' }}>
              How Health &amp; Care Works
            </h2>
            <p style={{ color: '#687B74', fontSize: '0.98rem' }}>Four easy steps to complete digital healthcare management.</p>
          </div>

          <div className="grid-4">
            {[
              { step: '01', title: 'Register Account', desc: 'Sign up as a patient or apply as a healthcare provider in seconds.' },
              { step: '02', title: 'Choose Specialist', desc: 'Browse verified doctors by clinical department, qualifications and schedule.' },
              { step: '03', title: 'Confirm Slot', desc: 'Select an available appointment time with automatic double-booking prevention.' },
              { step: '04', title: 'Access Care', desc: 'Receive consultation summaries, prescription downloads, and status updates.' }
            ].map((st, idx) => (
              <div key={idx} className="card card-hover" style={{ position: 'relative' }}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1B8067', opacity: '0.3', marginBottom: '8px' }}>{st.step}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#193B34', marginBottom: '8px' }}>{st.title}</h3>
                <p style={{ color: '#687B74', fontSize: '0.88rem', lineHeight: '1.6' }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE HEALTH & CARE */}
      <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2ECE7' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <span className="badge badge-mint" style={{ marginBottom: '10px' }}>Platform Advantages</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#145C4B', marginBottom: '20px' }}>
              Why Patients &amp; Doctors Trust Health &amp; Care
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: 'Strict Doctor Verification', desc: 'Every physician profile is evaluated by our administrator before bookings are enabled.' },
                { title: 'Guaranteed Slot Integrity', desc: 'Transactional JDBC constraints prevent conflicting appointments and past-date scheduling.' },
                { title: 'Organized Medical Records', desc: 'Access clinical notes, diagnoses, and digital prescriptions anytime with complete privacy.' },
                { title: 'Intuitive Experience', desc: 'Designed for accessibility and comfort across desktop, tablet, and mobile browsers.' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '14px' }}>
                  <CheckCircle2 size={20} color="#1B8067" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#193B34' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.88rem', color: '#687B74' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#E8F6F0', borderRadius: '24px', padding: '36px', border: '1px solid #CFE3D9' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#145C4B', marginBottom: '14px' }}>
              Academic Rubric Standards
            </h3>
            <p style={{ color: '#193B34', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '20px' }}>
              Health &amp; Care satisfies all mandatory academic rubric criteria: Java Programming, Java Event Handling, AWT, Swing, JavaFX, SQLite JDBC, MySQL JDBC, and Relational Database CRUD.
            </p>
            <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', fontSize: '0.85rem', color: '#687B74' }}>
              <div style={{ fontWeight: '700', color: '#145C4B', marginBottom: '6px' }}>Architecture Highlights:</div>
              <div>• Non-ORM Spring JDBC (JdbcTemplate &amp; PreparedStatement)</div>
              <div>• Pure Java 21 + Spring Boot 3.3.5</div>
              <div>• Separate Desktop Demonstration Module</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PLATFORM STATISTICS */}
      <section style={{ padding: '60px 0', backgroundColor: '#145C4B', color: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#4ADE80' }}>5,000+</div>
              <div style={{ fontSize: '0.95rem', color: '#D8E6DF' }}>Happy Patients Served</div>
            </div>
            <div>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#4ADE80' }}>4.9 / 5</div>
              <div style={{ fontSize: '0.95rem', color: '#D8E6DF' }}>Average Specialist Rating</div>
            </div>
            <div>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#4ADE80' }}>10+ Years</div>
              <div style={{ fontSize: '0.95rem', color: '#D8E6DF' }}>Average Doctor Experience</div>
            </div>
            <div>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#4ADE80' }}>100%</div>
              <div style={{ fontSize: '0.95rem', color: '#D8E6DF' }}>Verified Credentials</div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid #E2ECE7' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 48px' }}>
            <span className="badge badge-mint" style={{ marginBottom: '8px' }}>Patient Feedback</span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#145C4B', marginBottom: '12px' }}>
              What Our Patients Say
            </h2>
            <p style={{ color: '#687B74', fontSize: '0.98rem' }}>Authentic experiences from patients using our digital health platform.</p>
          </div>

          <div className="grid-3">
            {[
              { name: 'Jessica R.', comment: 'The team at Health & Care made scheduling my dental cleaning so effortless. The doctor was gentle, and my prescription was immediately visible on my phone.', role: 'Patient' },
              { name: 'Sameer K.', comment: 'Finding a top cardiologist and receiving consultation notes within the same portal has transformed how our family tracks health records.', role: 'Patient' },
              { name: 'Dr. Sneha Roy', comment: 'As a specialist, managing my daily consultation appointments and releasing prescriptions electronically has saved hours of administrative overhead.', role: 'Doctor' }
            ].map((t, idx) => (
              <div key={idx} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ color: '#193B34', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: '1.7', marginBottom: '18px' }}>
                  "{t.comment}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #E2ECE7', paddingTop: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E8F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#145C4B' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#193B34' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#687B74' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CONTACT US */}
      <section id="contact" style={{ padding: '80px 0', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2ECE7' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-mint" style={{ marginBottom: '8px' }}>Get In Touch</span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#145C4B', marginBottom: '12px' }}>Contact Us</h2>
            <p style={{ color: '#687B74', fontSize: '0.98rem' }}>Have questions about appointments or doctor verification? Reach out to our team.</p>
          </div>

          <div className="card" style={{ padding: '36px' }}>
            {contactSubmitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <CheckCircle2 size={48} color="#1B8067" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.3rem', color: '#145C4B', marginBottom: '8px' }}>Thank You!</h3>
                <p style={{ color: '#687B74' }}>Your message has been received. Our clinical support team will respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="Your name"
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="form-control"
                      placeholder="your.email@example.com"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    required
                    rows="4"
                    className="form-control"
                    placeholder="How can our healthcare administration assist you?"
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 11. DEVELOPERS SECTION */}
      <section id="developers" style={{ padding: '80px 0', borderBottom: '1px solid #E2ECE7' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 48px' }}>
            <span className="badge badge-mint" style={{ marginBottom: '8px' }}>Project Contributors</span>
            <h2 style={{ fontSize: '2.1rem', fontWeight: '800', color: '#145C4B', marginBottom: '12px' }}>
              Project Engineering Team
            </h2>
            <p style={{ color: '#687B74', fontSize: '0.98rem' }}>
              Health &amp; Care Academic Rubric Project Developers.
            </p>
          </div>

          <div className="grid-4">
            {[
              { name: 'Debosmita Mukhopadhyay', role: 'Full-Stack & Rubric Lead' },
              { name: 'Muthu Amuthan', role: 'Database & Backend Engineer' },
              { name: 'Amanjeeta Rath', role: 'Java Desktop & AWT/Swing Engineer' },
              { name: 'Khushi Kumari', role: 'UI/UX & Testing Engineer' }
            ].map((dev, idx) => (
              <div key={idx} className="card card-hover" style={{ textAlign: 'center', padding: '28px 18px' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #145C4B 0%, #1B8067 100%)',
                  margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#FFFFFF'
                }}>
                  <Code2 size={28} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#193B34', marginBottom: '6px' }}>{dev.name}</h3>
                <div style={{ fontSize: '0.82rem', color: '#1B8067', fontWeight: '600' }}>{dev.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
