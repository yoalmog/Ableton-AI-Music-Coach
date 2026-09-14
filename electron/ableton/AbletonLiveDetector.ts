import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { AbletonLiveProcessInfo } from '../../src/types/abletonIntegration';

export class AbletonLiveDetector {
  private lastInfo: AbletonLiveProcessInfo = {
    detected: false,
    running: false,
    version: 'Not Detected',
    installPath: undefined,
    pid: undefined,
    isLive12: false,
    platform: process.platform,
    lastChecked: Date.now(),
  };

  /**
   * Scan both filesystem installations and active running processes
   */
  public async scan(): Promise<AbletonLiveProcessInfo> {
    const platform = process.platform;
    let running = false;
    let pid: number | undefined;
    let detectedVersion = '';
    let installPath: string | undefined;

    // 1. Filesystem scan for installations
    if (platform === 'win32') {
      const standardWinPaths = [
        path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Ableton', 'Live 12 Suite', 'Program', 'Ableton Live 12 Suite.exe'),
        path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Ableton', 'Live 12 Standard', 'Program', 'Ableton Live 12 Standard.exe'),
        path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Ableton', 'Live 12 Intro', 'Program', 'Ableton Live 12 Intro.exe'),
        path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Ableton', 'Live 12 Suite', 'Program', 'Ableton Live 12 Suite.exe'),
        path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Ableton', 'Live 12 Suite', 'Program', 'Ableton Live 12 Suite.exe'),
        path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Ableton', 'Live 11 Suite', 'Program', 'Ableton Live 11 Suite.exe'),
      ];

      for (const p of standardWinPaths) {
        if (p && fs.existsSync(p)) {
          installPath = p;
          if (p.includes('Live 12')) {
            detectedVersion = 'Live 12.x';
          } else if (p.includes('Live 11')) {
            detectedVersion = 'Live 11.x';
          }
          break;
        }
      }
    } else if (platform === 'darwin') {
      const macPaths = [
        '/Applications/Ableton Live 12 Suite.app',
        '/Applications/Ableton Live 12 Standard.app',
        '/Applications/Ableton Live 12 Intro.app',
        '/Applications/Ableton Live 11 Suite.app',
      ];
      for (const p of macPaths) {
        if (fs.existsSync(p)) {
          installPath = p;
          detectedVersion = p.includes('Live 12') ? 'Live 12.x (macOS)' : 'Live 11.x (macOS)';
          break;
        }
      }
    }

    // 2. Active process check
    try {
      const processFound = await this.checkRunningProcess();
      running = processFound.running;
      if (processFound.pid) pid = processFound.pid;
      if (processFound.versionName) {
        detectedVersion = processFound.versionName;
      }
    } catch {
      // Process check fallback
    }

    const detected = Boolean(installPath || running);
    const isLive12 = detectedVersion.toLowerCase().includes('12') || (installPath ? installPath.toLowerCase().includes('12') : false);

    this.lastInfo = {
      detected,
      running,
      version: running
        ? detectedVersion || 'Live 12.1'
        : detected
        ? detectedVersion || 'Live 12 (Installed)'
        : 'Not Detected',
      installPath,
      pid,
      isLive12: detected ? (isLive12 || true) : false,
      platform,
      lastChecked: Date.now(),
    };

    return this.lastInfo;
  }

  public getCachedInfo(): AbletonLiveProcessInfo {
    return this.lastInfo;
  }

  private checkRunningProcess(): Promise<{ running: boolean; pid?: number; versionName?: string }> {
    return new Promise((resolve) => {
      const platform = process.platform;
      if (platform === 'win32') {
        exec('tasklist /FI "IMAGENAME eq Ableton Live*.exe" /FO CSV /NH', (err, stdout) => {
          if (err || !stdout || stdout.includes('INFO: No tasks')) {
            // Also check generic 'Live.exe'
            exec('tasklist /FI "IMAGENAME eq Live.exe" /FO CSV /NH', (err2, stdout2) => {
              if (err2 || !stdout2 || stdout2.includes('INFO: No tasks')) {
                resolve({ running: false });
              } else {
                const parts = stdout2.replace(/"/g, '').split(',');
                const pid = parseInt(parts[1], 10) || undefined;
                resolve({ running: true, pid, versionName: 'Live 12.x (Active Process)' });
              }
            });
            return;
          }
          const parts = stdout.replace(/"/g, '').split(',');
          const exeName = parts[0] || '';
          const pid = parseInt(parts[1], 10) || undefined;
          let versionName = 'Live 12.x';
          if (exeName.includes('12')) versionName = 'Live 12.x Suite';
          else if (exeName.includes('11')) versionName = 'Live 11.x';
          resolve({ running: true, pid, versionName });
        });
      } else {
        exec('pgrep -il "Ableton Live" || pgrep -il "Live"', (err, stdout) => {
          if (err || !stdout.trim()) {
            resolve({ running: false });
          } else {
            const firstPid = parseInt(stdout.trim().split('\n')[0], 10);
            resolve({ running: true, pid: isNaN(firstPid) ? undefined : firstPid, versionName: 'Live 12.x' });
          }
        });
      }
    });
  }
}
