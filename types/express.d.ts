import express from 'express';
import { LowdbSync } from 'lowdb';

declare global {
  namespace Express {
    interface Application {
      db: LowdbSync<any>;
    }
  }
}
