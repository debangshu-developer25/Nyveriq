import React from 'react';
import Sidebar from '../components/Layout/Sidebar';

const AboutMe: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ flex: 1, padding: 32, maxWidth: 700 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%', background: '#6366f1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 16,
        }}>
          DC
        </div>

        <h2 style={{ margin: '0 0 4px' }}>Debangshu Chanda</h2>
        <p style={{ color: '#6366f1', fontWeight: 500, marginTop: 0 }}>.NET Full-Stack Developer</p>

        <p style={{ color: '#475569', lineHeight: 1.6 }}>
          I'm a .NET full-stack developer based in Kolkata, India, with around 2 years of
          experience building web applications using C#, ASP.NET Core, React, and SQL Server.
          This project — TaskFlow — was built to demonstrate end-to-end full-stack development:
          Clean Architecture on the backend, JWT authentication, real-time-style updates, and a
          React + TypeScript frontend, all connected to a SQL Server database.
        </p>

        <h3 style={{ marginTop: 32, marginBottom: 12 }}>What this project demonstrates</h3>
        <ul style={{ color: '#475569', lineHeight: 1.8 }}>
          <li>Clean Architecture (.NET 8) — Domain, Application, Infrastructure, API layers</li>
          <li>JWT authentication with role-based authorization</li>
          <li>RESTful API design with full CRUD for Projects and Tasks</li>
          <li>Automatic audit logging for traceability</li>
          <li>React + TypeScript frontend with Context API, custom hooks, and React Router</li>
          <li>Drag-and-drop Kanban board with optimistic UI updates</li>
          <li>SQL Server with EF Core migrations and stored procedures</li>
        </ul>

        <h3 style={{ marginTop: 32, marginBottom: 12 }}>Connect with me</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          
          <a
            href="https://www.linkedin.com/in/debangshu-chanda-646128212/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 16px', background: '#0a66c2', color: '#fff',
              borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 500,
            }}
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/YOUR-GITHUB-USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 16px', background: '#1a1d27', color: '#fff',
              borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 500,
            }}
          
          >
            GitHub
          </a>
        <a href="https://www.facebook.com/debangshu2614.chanda/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
        padding: '8px 16px', background: '#1877f2', color: '#fff',
        borderRadius: 6, textDecoration: 'none', fontSize: 14, fontWeight: 500,
    }}
    >
        Facebook
    </a>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;