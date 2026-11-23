import type { ComponentType } from 'react';
import * as Py from './python';
import * as My from './mysql';

export const animations: Record<string, ComponentType> = {
  printVars: Py.PrintVars,
  fstring: Py.FString,
  traffic: Py.TrafficLight,
  indentation: Py.Indentation,
  loops: Py.Loops,
  collections: Py.Collections,
  functions: Py.Functions,
  arguments: Py.Arguments,
  modules: Py.Modules,
  pandasSeries: Py.PandasSeries,
  pandasMask: Py.PandasMask,
  plotting: Py.Plotting,
  register: My.SchoolRegister,
  ddlDml: My.DdlDml,
  insert: My.Insert,
  selectWhere: My.SelectWhere,
  like: My.Like,
  orderBy: My.OrderBy,
  updateDelete: My.UpdateDelete,
  eraserTearBurn: My.EraserTearBurn,
  alter: My.Alter,
  relations: My.Relations,
};
