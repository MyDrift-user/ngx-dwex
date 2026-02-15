import { Component } from '@angular/core';
import { PageTitle } from 'ngx-dwex';

@Component({
  selector: 'app-home',
  imports: [PageTitle],
  template: `
    <dwex-page-title 
      title="Welcome" 
      subtitle="This is a minimal Dwex demo with one workspace and one page" />
    
    <div style="padding: 24px;">
      <h2>Getting Started</h2>
      <p>
        This is the simplest possible Dwex application setup with:
      </p>
      <ul>
        <li>✅ One workspace</li>
        <li>✅ One navigation item</li>
        <li>✅ One page</li>
        <li>✅ Minimal configuration</li>
      </ul>
      
      <h3>Features Available</h3>
      <p>Even in this minimal setup, you get:</p>
      <ul>
        <li>🎨 Full theming support (light/dark modes, 5 color palettes)</li>
        <li>📱 Responsive design (mobile and desktop)</li>
        <li>🎯 Professional UI shell structure</li>
        <li>⚡ Material Design 3 components</li>
      </ul>
      
      <h3>Next Steps</h3>
      <p>To expand this demo:</p>
      <ol>
        <li>Add more pages to the routes</li>
        <li>Add more navigation items to the workspace</li>
        <li>Add settings pages</li>
        <li>Create multiple workspaces</li>
      </ol>
      
      <p style="margin-top: 32px; padding: 16px; background: var(--mat-sys-surface-container); border-radius: 8px;">
        <strong>📖 Documentation:</strong> See the CUSTOMIZATION.md file for all available options and features.
      </p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    h2 {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 16px;
      color: var(--mat-sys-on-surface);
    }
    
    h3 {
      font-size: 18px;
      font-weight: 500;
      margin-top: 24px;
      margin-bottom: 12px;
      color: var(--mat-sys-on-surface);
    }
    
    p {
      line-height: 1.6;
      color: var(--mat-sys-on-surface-variant);
      margin-bottom: 12px;
    }
    
    ul, ol {
      line-height: 1.8;
      color: var(--mat-sys-on-surface-variant);
      margin-bottom: 16px;
    }
    
    li {
      margin-bottom: 8px;
    }
  `]
})
export class HomePage {}
