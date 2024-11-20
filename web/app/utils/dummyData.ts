export function dummyData() {
    return(
        {
          assessmentCollections: [
            {
              id: 1,
              name: "Assessment Collection 1",
              assessments: [
                {
                  id: 1,
                  name: "Q4 2023 Assessment",
                  type: "Maturity & Environment",
                  status: "Completed",
                  maturityStatus: "Completed",
                  environmentStatus: "Completed",
                  completionDate: "12/31/2023",
                  maturityScore: 940,
                  environmentScore: 900,
                  subprocesses: [
                    {
                      id: 1,
                      name: "Sub-Process A: Organizing",
                      status: "Completed",
                      attributes: [
                        {
                          id: 1,
                          name: "A.1. Product-Oriented Work Breakdown Structure (WBS)",
                          rating: 5,
                          score: 22,
                          comments: "Rigorous review on actuals, in a timely manner."
                        },
                        {
                          id: 2,
                          name: "A.2. Work Breakdown Structure (WBS) Hierarchy",
                          rating: 4,
                          score: 14,
                          comments: null
                        },
                        {
                            id: 3,
                            name: "A.3. Organizational Breakdown Structure (OBS)",
                            rating: 5,
                            score: 22,
                            comments: "Need to plan heavy equipment and shipping materials resale."
                        },
                        {
                            id: 4,
                            name: "A.4. Integrated System with Common Structures",
                            rating: 5,
                            score: 22,
                            comments: null
                        },
                        {
                            id: 5,
                            name: "A.5. Control Account (CA) to Organizational Element",
                            rating: 5,
                            score: 22,
                            comments: null
                        },
                      ]
                    },
                    {
                      id: 2,
                      name: "Sub-Process B: Planning and Scheduling",
                      status: "Completed",
                      attributes: [
                        {
                          id: 1,
                          name: "",
                          rating: 5,
                          score: 22,
                          comments: null
                        },
                        {
                          id: 2,
                          name: "",
                          rating: 3,
                          score: 11,
                          comments: null
                        }
                      ]
                    },
                    {
                        id: 3,
                        name: "Sub-Process C: Budgeting and Work Authorization",
                        status: "Completed",
                        attributes: [
                          {
                            id: 1,
                            name: "",
                            rating: 5,
                            score: 22,
                            comments: null
                          },
                          {
                            id: 2,
                            name: "",
                            rating: 4,
                            score: 14,
                            comments: null
                          }
                        ]
                      },
                      {
                        id: 4,
                        name: "Sub-Process D: Accounting Considerations",
                        status: "Completed",
                        attributes: [
                          {
                            id: 1,
                            name: "",
                            rating: 5,
                            score: 22,
                            comments: null
                          },
                          {
                            id: 2,
                            name: "",
                            rating: 4,
                            score: 14,
                            comments: null
                          }
                        ]
                      },
                      {
                        id: 5,
                        name: "Sub-Process E: Indirect Budget and Cost Management",
                        status: "Completed",
                        attributes: [
                          {
                            id: 1,
                            name: "",
                            rating: 5,
                            score: 22,
                            comments: null
                          },
                          {
                            id: 2,
                            name: "",
                            rating: 4,
                            score: 14,
                            comments: null
                          }
                        ]
                      },
                      {
                        id: 6,
                        name: "Sub-Process F: Analysis and Management Reporting",
                        status: "Completed",
                        attributes: [
                          {
                            id: 1,
                            name: "",
                            rating: 5,
                            score: 22,
                            comments: null
                          },
                          {
                            id: 2,
                            name: "",
                            rating: 4,
                            score: 14,
                            comments: null
                          }
                        ]
                      },
                      {
                        id: 7,
                        name: "Sub-Process G: Change Control",
                        status: "Completed",
                        attributes: [
                          {
                            id: 1,
                            name: "",
                            rating: 5,
                            score: 22,
                            comments: null
                          },
                          {
                            id: 2,
                            name: "",
                            rating: 4,
                            score: 14,
                            comments: null
                          }
                        ]
                      },
                      {
                        id: 8,
                        name: "Sub-Process H: Material Management",
                        status: "Completed",
                        attributes: [
                          {
                            id: 1,
                            name: "",
                            rating: 5,
                            score: 22,
                            comments: null
                          },
                          {
                            id: 2,
                            name: "",
                            rating: 4,
                            score: 14,
                            comments: null
                          }
                        ]
                      },
                      {
                        id: 9,
                        name: "Sub-Process I: Subcontract Management",
                        status: "Completed",
                        attributes: [
                          {
                            id: 1,
                            name: "",
                            rating: 5,
                            score: 22,
                            comments: null
                          },
                          {
                            id: 2,
                            name: "",
                            rating: 4,
                            score: 14,
                            comments: null
                          }
                        ]
                      },
                      {
                        id: 10,
                        name: "Sub-Process J: Risk Management",
                        status: "Completed",
                        attributes: [
                          {
                            id: 1,
                            name: "",
                            rating: 5,
                            score: 22,
                            comments: null
                          },
                          {
                            id: 2,
                            name: "",
                            rating: 4,
                            score: 14,
                            comments: null
                          }
                        ]
                      },
                  ],
                  categories: [
                    {
                      id: 1,
                      name: "1. Culture",
                      status: "Completed",
                      attributes: [
                        {
                          id: 1,
                          name: "1a. The <b>contractor organization is supportive and committed</b> to EVMS implementation, including making the necessary investments for regular maintenance and self-governance.",
                          rating: 5,
                          score: 78,
                          comments: null
                        },
                        {
                          id: 2,
                          name: "1b. The project/program <b>culture fosters trust, honesty, transparency, communication, and shared values</b> across functions.",
                          rating: 4,
                          score: 45,
                          comments: null
                        }
                      ]
                    },
                    {
                      id: 2,
                      name: "2. People",
                      status: "Completed",
                      attributes: [
                        {
                          id: 1,
                          name: "",
                          rating: 5,
                          score: 67,
                          comments: null
                        },
                        {
                          id: 2,
                          name: "",
                          rating: 5,
                          score: 54,
                          comments: null
                        }
                      ]
                    },
                    {
                        id: 3,
                        name: "3. Practices",
                        status: "Completed",
                        attributes: [
                          {
                            id: 1,
                            name: "",
                            rating: 5,
                            score: 78,
                            comments: null
                          },
                          {
                            id: 2,
                            name: "",
                            rating: 4,
                            score: 45,
                            comments: null
                          }
                        ]
                    },
                    {
                        id: 4,
                        name: "4. Resources",
                        status: "Completed",
                        attributes: [
                          {
                            id: 1,
                            name: "",
                            rating: 5,
                            score: 78,
                            comments: null
                          },
                          {
                            id: 2,
                            name: "",
                            rating: 4,
                            score: 45,
                            comments: null
                          }
                        ]
                    },
                  ]
                },
                {
                  id: 2,
                  name: "Q3 2023 Assessment",
                  type: "Maturity & Environment",
                  status: "Completed",
                  maturityStatus: "Completed",
                  environmentStatus: "Completed",
                  completionDate: "09/30/2023",
                  maturityScore: 940,
                  environmentScore: 900,
                  subprocesses: [
                    {
                      id: 1,
                      name: "Sub-Process A: Organizing",
                      status: "Completed",
                      attributes: [
                        {
                          id: 1,
                          name: "",
                          rating: 5,
                          score: 22,
                          comments: null
                        },
                        {
                          id: 2,
                          name: "",
                          rating: 4,
                          score: 14,
                          comments: null
                        }
                      ]
                    },
                    {
                      id: 2,
                      name: "Sub-Process B: Planning and Scheduling",
                      status: "Completed",
                      attributes: [
                        {
                          id: 1,
                          name: "",
                          rating: 5,
                          score: 22,
                          comments: null
                        },
                        {
                          id: 2,
                          name: "",
                          rating: 3,
                          score: 11,
                          comments: null
                        }
                      ]
                    }
                  ],
                  categories: [
                    {
                      id: 1,
                      name: "1. Culture",
                      status: "Completed",
                      attributes: [
                        {
                          id: 1,
                          name: "",
                          rating: 5,
                          score: 78,
                          comments: null
                        },
                        {
                          id: 2,
                          name: "",
                          rating: 4,
                          score: 45,
                          comments: null
                        }
                      ]
                    },
                    {
                      id: 2,
                      name: "2. People",
                      status: "Completed",
                      attributes: [
                        {
                          id: 1,
                          name: "",
                          rating: 5,
                          score: 67,
                          comments: null
                        },
                        {
                          id: 2,
                          name: "",
                          rating: 5,
                          score: 54,
                          comments: null
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 3,
                  name: "LANL Maturity Assessment - Site Leaders",
                  type: "Maturity",
                  status: "In Progress",
                  maturityStatus: "In Progress",
                  environmentStatus: null,
                  completionDate: null,
                  maturityScore: 0,
                  environmentScore: null,
                  subprocesses: [
                    {
                      id: 1,
                      status: "Completed",
                      name: "Sub-Process A: Organizing",
                      attributes: [
                        {
                          id: 1,
                          name: "",
                          rating: 5,
                          score: 22,
                          comments: null
                        },
                        {
                          id: 2,
                          name: "",
                          rating: 4,
                          score: 14,
                          comments: null
                        }
                      ]
                    },
                    {
                      id: 2,
                      status: "In Progress",
                      name: "Sub-Process B: Planning and Scheduling",
                      attributes: [
                        {
                          id: 1,
                          name: "B.1. Authorized, Time-Phased Work Scope",
                          rating: 5,
                          score: 22,
                          comments: null
                        },
                        {
                          id: 2,
                          name: "B.2. Schedule Provides Current Status",
                          rating: null,
                          score: 0,
                          comments: null
                        }
                      ]
                    }
                  ],
                  categories: []
                },
                {
                  id: 4,
                  name: "Q2 2023 Maturity Assessment",
                  type: "Maturity",
                  status: "Completed",
                  maturityStatus: "Completed",
                  environmentStatus: null,
                  completionDate: "06/30/2023",
                  maturityScore: 940,
                  environmentScore: null,
                  subprocesses: [
                    {
                      id: 1,
                      status: "Completed",
                      name: "Sub-Process A: Organizing",
                      attributes: [
                        {
                          id: 1,
                          name: "",
                          rating: 5,
                          score: 22,
                          comments: null
                        },
                        {
                          id: 2,
                          name: "",
                          rating: 4,
                          score: 14,
                          comments: null
                        }
                      ]
                    },
                    {
                      id: 2,
                      status: "Completed",
                      name: "Sub-Process B: Planning and Scheduling",
                      attributes: [
                        {
                          id: 1,
                          name: "",
                          rating: 5,
                          score: 22,
                          comments: null
                        },
                        {
                          id: 2,
                          name: "",
                          rating: 3,
                          score: 11,
                          comments: null
                        }
                      ]
                    }
                  ],
                  categories: []
                },
                {
                  id: 5,
                  name: "Q1 2023 Environment Assessment",
                  type: "Environment",
                  status: "Completed",
                  maturityStatus: null,
                  environmentStatus: "Completed",
                  completionDate: "03/31/2023",
                  maturityScore: null,
                  environmentScore: 900,
                  subprocesses: [],
                  categories: [
                    {
                      id: 1,
                      status: "Completed",
                      name: "1. Culture",
                      attributes: [
                        {
                          id: 1,
                          name: "",
                          rating: 5,
                          score: 78,
                          comments: null
                        },
                        {
                          id: 2,
                          name: "",
                          rating: 4,
                          score: 45,
                          comments: null
                        }
                      ]
                    },
                    {
                      id: 2,
                      status: "Completed",
                      name: "2. People",
                      attributes: [
                        {
                          id: 1,
                          name: "",
                          rating: 5,
                          score: 67,
                          comments: null
                        },
                        {
                          id: 2,
                          name: "",
                          rating: 5,
                          score: 54,
                          comments: null
                        }
                      ]
                    }
                  ]
                },
              ]
            },
            {
                id: 2,
                name: "Assessment Collection 2",
                assessments: []
            },
            {
                id: 3,
                name: "Assessment Collection 3",
                assessments: []
            }
          ],
        }
      )
}