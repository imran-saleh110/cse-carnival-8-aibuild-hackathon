/* 
  CRUD API for campus notices (class changes, exams, events, emergencies).
  Each has a priority (high/medium/low) and an expiry date.
*/

import { Request, Response } from 'express';
import { AnnouncementModel } from '../models/Announcement';



// Returns all announcements, sorted newest first.
// Filter by priority, status (active/expired), or posted_by.
export const listAnnouncements = async (req: Request, res: Response) => {
  const { priority, status, posted_by } = req.query;

  const announcements = await AnnouncementModel.findAll({
    priority: priority as string | undefined,
    status: status as string | undefined,
    posted_by: posted_by as string | undefined,
  });

  res.json(announcements);
};



// Returns a single announcement by ID.
export const getAnnouncement = async (req: Request, res: Response) => {
  const ann = await AnnouncementModel.findById(req.params.id as string);

  if (!ann) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  res.json(ann);
};



// Creates a new announcement. Requires: id, title, body, announcement_date,
// priority, posted_by, expires_date. Status defaults to "active".
export const createAnnouncement = async (req: Request, res: Response) => {
  const ann = await AnnouncementModel.create(req.body);
  res.status(201).json(ann);
};



// Updates an announcement by ID. Only provided fields are changed.
export const updateAnnouncement = async (req: Request, res: Response) => {
  const ann = await AnnouncementModel.update(req.params.id as string, req.body);

  if (!ann) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  res.json(ann);
};


// Deletes an announcement by ID.
export const deleteAnnouncement = async (req: Request, res: Response) => {
  const ann = await AnnouncementModel.delete(req.params.id as string);

  if (!ann) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  res.json({ message: 'Announcement deleted', announcement: ann });
};