// TODO (Phase 2): verify JWT from the Authorization header and attach req.user = { id, role }.
export function requireAuth(_req, _res, next) { next(); }
export function requireTeacher(_req, _res, next) { next(); }
