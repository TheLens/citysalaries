
'''docstring'''

import re


class Clean(object):

    '''docstring'''

    def departments(self, value):
        '''docstring'''

        departments = [
            [r'^Cao ', 'Chief Administrative Office - '],
            [' Cao ', ''],
            [' Cao-', ''],
            [r'^Ccd ', 'Clerk of Criminal District Court - '],
            [r'^Cco ', 'City Council - '],
            [r'^Cor ', "Coroner's Office - "],
            [r'^Cpc ', 'City Planning Commission - '],
            [' Cpc ', ''],
            [
                'Csd Canal St. Development Corp',
                'Canal Street Development Corporation'
            ],
            [r'^Cvs ', 'Civil Service Department - '],
            [r'^Edf ', ''],
            [r'^Edf ', 'Economic Development Fund '],
            [r'^Fin ', 'Finance Department - '],
            [r'^Fir ', 'Fire Department - '],
            [r'^Fmc ', 'French Market Corporation - '],
            [r'^Hdl ', ''],
            [r'^Hel ', 'Health Department - '],
            [r'^Hud ', 'Housing and Urban Development - '],
            [r'^Hus ', 'Human Services - '],
            [r'^Ipm ', 'Independent Police Monitor - '],
            [r'^Jur ', 'Judicial Retirement - '],
            [r'^Jvc ', 'Juvenile Court - '],
            [r'^Law ', 'Law Department - '],
            [r'^Lib ', 'Library - '],
            [r'^May ', "Mayor's Office - "],
            [r'^Mcb ', 'Mosquito, Termite and Rodent Control Board - '],
            [r'^McB ', 'Mosquito, Termite and Rodent Control Board - '],
            [r'^Mis ', 'Miscellaneous - '],
            [r'^Moa ', 'Museum of Art - '],
            [r'^Muc ', 'Municipal Court - '],
            [
                'Myh Municipal Yacht Harbor Cor',
                'Municipal Yacht Harbor Corporation'
            ],
            [r'^Nab ', ''],
            [r'^Nhi ', ''],
            ['Nhif ', 'Neighborhood Housing Improvement Fund - '],
            [r'^Oig ', 'Office of Inspector General - '],
            [r'^Pap ', 'Parks and Parkways - '],
            [r'^Pol ', 'Police Department - '],
            [r'^Prm ', 'Property Management - '],
            [r'^Pwr ', 'Public Works - '],
            [r'^Rdc ', 'Recreation Development Commission - '],
            [r'^Rec ', 'Recreation - '],
            [r'^San ', 'Sanitation - '],
            [r'^Sap ', 'Safety and Permits - '],
            [r'^Trc ', ''],
            ['Vcc Vieux Carre Commission', 'Vieux Carre Commission'],
            [r'^Wia Wia ', 'Workforce Investment Act - '],
            ['Emd-', 'Equipment Maintenance Division - '],
            ['-Hosp-', '- Hospital - '],
            ['Mgt ', 'Management '],
            ['Mgmt', 'Management'],
            ['Managemnt', 'Management'],
            ['Munc.', 'Municipal'],
            ['-Special', '- Special'],
            ['-Enhancement', '- Enhancement'],
            ['Dist ', 'District '],
            [r'Dist\.', 'District'],
            [r'Dist$', 'District'],
            ['Landmark Com', 'Landmarks Commission'],
            ['Fnd', 'Fund'],
            ['Svcs', 'Services'],
            ['-Crim', ' - Criminal'],
            [' Of ', ' of '],
            [' And ', ' and '],
            [' The ', ' the '],
            ['Fmc ', ''],
            ['S&P, ', ''],
            ['S&P ', ''],
            ['Directors ', 'Director\'s'],
            [r'Bure$', 'Bureau'],
            [r'Cours$', 'Course'],
            ['Offc', 'Office'],
            ['-Capital', '- Capital'],
            [' & ', ' and '],
            [r'Admin$', 'Administration'],
            [r'Admin/', 'Administration/'],
            ['Gf', 'General Fund'],
            ['Ta ', 'TA '],  # TODO: Treasury administration? Can't find
            # ['E P Rev ', '???'],  # TODO: ???
            ['Rev Fund', 'Revenue Fund'],
            ['Nasa ', 'NASA '],
            ['Esse ', 'Essential '],
            ['Pub ', 'Public '],
            ['Cd ', 'CD '],
            ['Heal ', 'Health '],
            ['Medical Service', 'Medical Services'],
            [r'Administr$', 'Administration'],
            [r'Init$', 'Initiative'],
            ['Wic ', 'Women, Infants and Children '],
            ['Prog ', 'Program '],
            ['Rehab ', 'Rehabilitation '],
            ['Hopwa', 'Housing Opportunities for Persons with AIDS'],
            ['Ysc', 'Youth Study Center'],
            ['Dcdbg', 'Disaster Community Development Block Grant'],
            ['Cdbg', 'Community Development Block Grant'],
            [r'Init\.', 'Initiative'],
            ['Intergov ', 'Intergovernmental '],
            [r'Engage$', 'Engagement'],
            [r'Entertain$', 'Entertainment'],
            ['Ofc ', 'Office '],
            [', & ', ' and '],
            [', and ', ' and '],
            ['Misc ', 'Miscellaneous '],
            [r'Administrat$', 'Administration'],
            ['Norc ', 'New Orleans Recreation Development Commission '],
            ['Spec Program', 'Special Program'],
            [r'Innov$', 'Innovation'],
            ['Office-Perform ', 'Office of Performance '],
            [r'Accountab$', 'Accountability'],
            ['Ofc ', 'Office '],
            ['Pdu', 'Project Delivery Unit'],
            [r'Demo$', 'Demolition'],
            [r'Ad$', 'Administration'],
            [r'Div$', 'Division'],
            [r'Adm$', 'Administration'],
            ['Sprt Bureau', 'Support Bureau'],
            ['Off ', 'Office '],
            [r'Off$', 'Office'],
            ['Mnt', 'Maintenance'],
            [r'Inspect$', 'Inspector'],
            [r'Inspct$', 'Inspector'],
            ['Tfc ', 'Traffic Court '],
            ['Court Court ', 'Court '],
            [
                '-Prevention Insp and Educ',
                ' - Prevention, Inspection and Education'
            ],
            [r'\s+', ' '],  # Multiple spaces
        ]

        for department in departments:
            value = re.sub(
                department[0],
                department[1],
                value
            )

        return value

    def all(self, value):
        '''docstring'''

        value = str(value)

        cleaned_value = self.descendents(value)
        cleaned_value = self.mc_names(cleaned_value)
        cleaned_value = self.middle_names(cleaned_value)

        return cleaned_value

    def job_titles_only(self, value):
        '''docstring'''

        cleaned_value = self.all(value)
        cleaned_value = self.job_titles(cleaned_value)

        return cleaned_value

    def departments_only(self, value):
        '''docstring'''

        cleaned_value = self.all(value)
        cleaned_value = self.departments(cleaned_value)

        return cleaned_value

    def descendents(self, value):
        '''docstring'''

        descendents = [
            [r'Ii$', 'II'],
            [' Ii ', ' II '],
            [r'Iii$', 'III'],
            [' Iii ', ' III '],
            [r'Iv$', 'IV'],
            [' Iv ', ' IV '],
            [r'Vi$', 'VI'],
            [r'Jr$', 'Jr.'],
            [' Jr ', ' Jr. '],
            [r'Sr$', 'Sr.'],
            [' Sr ', ' Sr. '],
            [', Sr', ' Sr'],
            [', Jr', ' Jr'],
            ['  Jr', ' Jr'],
            ['  Sr', ' Sr'],
            ["'S ", "'s "]
        ]

        for descendent in descendents:
            # Don't check if...in because of regex checks
            value = re.sub(
                descendent[0],
                descendent[1],
                value
            )

        return value

    def job_titles(self, value):
        '''docstring'''

        job_titles = [
            ['Administratio', 'Administration'],
            ['Administratr', 'Administrator'],
            ['Admin3', 'Administrator III'],
            ['Recreation Admin ', 'Recreation Administrator '],
            ['Judicial Admin ', 'Judicial Administrator '],
            ['Assistant Chief Admin ', 'Assistant Chief Administrative '],
            [r'Project Adm$', 'Project Adminstrator'],
            ['Airport Admin ', 'Airport Administrative '],
            ['Adminstrative', 'Administrative'],
            [r'^Admin ', 'Administrative '],
            [r'Admin$', 'Administrator'],
            [' Admin, ', ' Administrator, '],
            [r'Administrato$', 'Administrator'],
            ['Adm & Prog S', 'Administrative & Program Support'],
            ['Wkr', 'Worker'],
            [r'Ig$', '(Inspector General)'],
            ['Ig ', 'Inspector General '],
            ['I&E', 'Inspections and Evaluations'],
            ['Ocjc', 'Orleans Criminal Justice Coordination'],
            ['Proj&Plan', 'Project & Planning'],
            ['Emer ', 'Emergency '],
            ['Mgt ', 'Management '],
            [r'Mgt$', 'Management'],
            ['Dpw', 'Department of Public Works'],
            ['Dep ', 'Deputy '],
            [r'Dir$', 'Director'],
            ['Dir ', 'Director '],
            [',Director', ', Director'],
            ['Hvac', 'HVAC'],
            [r'^Sr ', 'Senior '],
            ['Tech ', 'Technician '],
            ['Ems', 'EMS'],
            ['Maint ', 'Maintenance '],
            [r'Maint$', 'Maintenance'],
            [' Of ', ' of '],
            [r'Off$', 'Officer'],
            ['Offc', 'Officer'],
            ['Ofc', 'Office'],
            ['Officerr', 'Officer'],
            ['Reduc ', 'Reduction '],
            ['Clk', 'Clerk'],
            ['Crm', 'Criminal'],
            ['Supv ', 'Supervisor '],
            [r'Supv$', 'Supervisor'],
            ['Supvsor', 'Supervisor'],
            ['Supvervisor', 'Supervisor'],
            [r'Communications Sup$', 'Communications Supervisor'],
            ['Mtnc', 'Maintenance'],
            ['Mgr', 'Manager'],
            [r'Cashier Sup$', 'Cashier Supervisor'],
            ['Assoc ', 'Associate '],
            [r'Assoc$', 'Associate'],
            ['Asst', 'Assistant'],
            ['Asst.', 'Assistant'],
            ['Ast ', 'Assistant '],
            [r'Assist$', 'Assistant'],
            ['Assistant to Mayor', 'Assistant to the Mayor'],
            ['Recov ', 'Recovery '],
            ['Prop ', 'Property '],
            ['Supprt', 'Support'],
            ['Supt', 'Superintendent'],
            ['Rel ', 'Relations '],
            ['Comm ', 'Communications '],
            ['Ex ', 'Executive '],
            ['Dist ', 'District '],
            ['Ct', 'Court'],
            ['Equip ', 'Equipment '],
            ['Equiment', 'Equipment'],
            ['Serv ', 'Service '],
            [' And ', ' and '],
            [' To ', ' to '],
            [' The ', ' the '],
            [' For ', ' for '],
            ['Med ', 'Medical '],
            ['Cord ', 'Coordinator '],
            [r'Cord$', 'Coordinator'],
            ['Dev ', 'Development '],
            [' Spec ', ' Specialist '],
            [r'\(Spec Programs\)', '(Special Programs)'],
            ['Crimin ', 'Criminal '],
            ['Corp ', 'Corporation '],
            [r'Corp$', 'Corporation'],
            [r'Spec$', 'Specialist'],
            ['Spec ', 'Specialist '],
            ['Prkwys', 'Parkways'],
            ['Sect ', 'Section '],
            [r'Dec$', 'Decree'],
            ['Mtnc', 'Maintenance'],
            ['Fema', 'FEMA'],
            ['I. ', 'I '],
            ['Cdbg', 'Community Development Block Grant'],
            ['Dcdbg', 'Disaster Community Development Block Grant'],
            ['Mun ', 'Municipal '],
            ['Enf ', 'Enforcement '],
            ['Operato ', 'Operator '],
            ['Athl ', 'Athletic '],
            ['Constructio ', 'Construction '],
            [r'Constructio$', 'Construction'],
            [r'Contructio$', 'Construction'],
            ['Spcl', 'Specialist'],
            [r'\(Ig\)', '(Inspector General)'],
            ['Proj ', 'Project '],
            ['Frst', 'First'],
            ['Insp & Eval', 'Inspection and Evaluation'],
            ['Insp and Eval', 'Inspection and Evaluation'],
            [r'Supervis$', 'Supervisor'],
            ['Supervis ', 'Supervisor '],
            [r'Operato$', 'Operator'],
            ['Attorney 1', 'Attorney I'],
            ['Attorney 3', 'Attorney III'],
            ['Dwi ', 'DWI '],
            ['Dpty', 'Deputy'],
            ['Depuity', 'Deputy'],
            [r'Investig$', 'Investigations'],
            [r'Constructio$', 'Construction'],
            ['Info Sys ', 'Information Systems '],
            [r'Info Sys$', 'Information Systems'],
            ['Equipment Operator I', 'Equipment Operator 1'],
            ['/Cd', '/Community Development Block Grant)'],
            ['Analyt ', 'Analyst '],
            [r'Analyt$', 'Analyst'],
            ['Mangement', 'Management'],
            ['Marketining', 'Marketing'],
            ['Coord ', 'Coordinator '],
            [r'Coord$', 'Coordinator'],
            ['Mntc', 'Maintenance'],
            ['Rec ', 'Recreation '],
            ['Applic ', 'Applications '],
            [r'Deve$', 'Developer'],
            ['Courtl', 'Control'],
            ['Contol', 'Control'],
            ['Aut ', 'Auto '],
            ['Clerk 2', 'Clerk II'],
            [r'Rivergate Development C$', 'Rivergate Development Corporation'],
            [r'Tech$', 'Technician'],
            ['Mech ', 'Mechanical '],
            ['Pub ', 'Public '],
            [',Trainee', ', Trainee'],
            ['Pol Sec Empl', 'Police Secondary Employment'],
            ['Suppport', 'Support'],
            ['Councilmanic', 'Council'],
            ['Technician Int', 'Technician Intermediate'],
            [r'Program M$', 'Program Manager'],
            ['Exec ', 'Executive '],
            ['Reg ', 'Regulation '],
            ['Telecomm ', 'Telecommunications '],
            ['Telecom ', 'Telecommunications '],
            [r'Serv$', 'Services'],
            ['Mg ', 'Manager '],
            [r'Mg$', 'Manager'],
            ['Sr. Trans', 'Senior Trans'],
            ['Sr. Dispatcher', 'Senior Dispatcher'],
            ['Sr. Analyst', 'Senior Analyst'],
            ['Sr. Worker', 'Senior Worker'],
            ['Info Processing', 'Information Processing'],
            ['Pest Control Inspector 2', 'Pest Control Inspector II'],
            [
                r"Physician \(Coronor's Path0\)",
                "Physician (Coroner's Pathologist)"
            ],
            [
                'Public Works Maintenance Super',
                'Public Works Maintenance Superintendent'
            ]
        ]

        for job_title in job_titles:
            # Don't check if...in because of regex checks
            value = re.sub(
                job_title[0],
                job_title[1],
                value
            )

        return value

    def mc_names(self, value):
        '''docstring'''

        mc_names = [
            ['Mca', 'McA'],
            ['Mcb', 'McB'],
            ['Mcc', 'McC'],
            ['Mcd', 'McD'],
            ['Mce', 'McE'],
            ['Mcf', 'McF'],
            ['Mcg', 'McG'],
            ['Mch', 'McH'],
            ['Mci', 'McI'],
            ['Mcj', 'McJ'],
            ['Mck', 'McK'],
            ['Mcl', 'McL'],
            ['Mcm', 'McM'],
            ['Mcn', 'McN'],
            ['Mco', 'McO'],
            ['Mcp', 'McP'],
            ['Mcq', 'McQ'],
            ['Mcr', 'McR'],
            ['Mcs', 'McS'],
            ['Mct', 'McT'],
            ['Mcu', 'McU'],
            ['Mcv', 'McV'],
            ['Mcw', 'McW'],
            ['Mcx', 'McX'],
            ['Mcy', 'McY'],
            ['Mcz', 'McZ']
        ]

        for mc_name in mc_names:
            if mc_name[0] in value:
                value = re.sub(
                    mc_name[0],
                    mc_name[1],
                    value
                )

        return value

    def middle_names(self, value):
        '''docstring'''

        middle_initials = [
            [r' A$', ' A.'],
            [r' B$', ' B.'],
            [r' C$', ' C.'],
            [r' D$', ' D.'],
            [r' E$', ' E.'],
            [r' F$', ' F.'],
            [r' G$', ' G.'],
            [r' H$', ' H.'],
            [r' I$', ' I.'],
            [r' J$', ' J.'],
            [r' K$', ' K.'],
            [r' L$', ' L.'],
            [r' M$', ' M.'],
            [r' N$', ' N.'],
            [r' O$', ' O.'],
            [r' P$', ' P.'],
            [r' Q$', ' Q.'],
            [r' R$', ' R.'],
            [r' S$', ' S.'],
            [r' T$', ' T.'],
            [r' U$', ' U.'],
            [r' V$', ' V.'],
            [r' W$', ' W.'],
            [r' X$', ' X.'],
            [r' Y$', ' Y.'],
            [r' Z$', ' Z.']
        ]

        for middle_initial in middle_initials:
            if middle_initial[0] in value:
                value = re.sub(
                    middle_initial[0],
                    middle_initial[1],
                    value
                )

        return value
