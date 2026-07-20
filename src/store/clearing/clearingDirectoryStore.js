import { create } from "zustand";

import {
  getClearingPeople,
  createClearingPerson,
  updateClearingPerson,
  getClearingCompanies,
  createClearingCompany,
  updateClearingCompany,
} from "@api";

const getApiError = (error, fallback) => {
  const data = error?.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (data?.detail) {
    return data.detail;
  }

  return data || fallback;
};

export const useClearingDirectoryStore = create((set) => ({
  people: [],
  companies: [],

  isLoadingPeople: false,
  isLoadingCompanies: false,
  isSubmitting: false,
  error: null,

  loadPeople: async (search = "") => {
    set({
      isLoadingPeople: true,
      error: null,
    });

    try {
      const people = await getClearingPeople({
        ...(search ? { search } : {}),
      });

      set({
        people,
        isLoadingPeople: false,
      });

      return people;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка загрузки людей"),
        isLoadingPeople: false,
      });

      throw error;
    }
  },

  loadCompanies: async (search = "") => {
    set({
      isLoadingCompanies: true,
      error: null,
    });

    try {
      const companies = await getClearingCompanies({
        ...(search ? { search } : {}),
      });

      set({
        companies,
        isLoadingCompanies: false,
      });

      return companies;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка загрузки фирм"),
        isLoadingCompanies: false,
      });

      throw error;
    }
  },

  createPerson: async (payload) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      const person = await createClearingPerson(payload);

      set((state) => ({
        people: [...state.people, person].sort((a, b) =>
          a.name.localeCompare(b.name, "ru")
        ),
        isSubmitting: false,
      }));

      return person;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка создания человека"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  updatePerson: async (personId, payload) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      const person = await updateClearingPerson(personId, payload);

      set((state) => ({
        people: state.people.map((item) =>
          item.id === person.id ? person : item
        ),
        isSubmitting: false,
      }));

      return person;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка обновления человека"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  createCompany: async (payload) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      const company = await createClearingCompany(payload);

      set((state) => ({
        companies: [...state.companies, company].sort((a, b) =>
          a.name.localeCompare(b.name, "ru")
        ),
        isSubmitting: false,
      }));

      return company;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка создания фирмы"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  updateCompany: async (companyId, payload) => {
    set({
      isSubmitting: true,
      error: null,
    });

    try {
      const company = await updateClearingCompany(companyId, payload);

      set((state) => ({
        companies: state.companies.map((item) =>
          item.id === company.id ? company : item
        ),
        isSubmitting: false,
      }));

      return company;
    } catch (error) {
      set({
        error: getApiError(error, "Ошибка обновления фирмы"),
        isSubmitting: false,
      });

      throw error;
    }
  },

  clearDirectories: () => {
    set({
      people: [],
      companies: [],
      error: null,
    });
  },
}));
