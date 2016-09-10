#!/usr/bin/env python2.7
# -*- coding: utf-8 -*-
#
"""
Analyze hashes.csv.
"""
from __future__ import (absolute_import, division, print_function,
                        unicode_literals)
__version__ = '0.0.1.dev1'


def main():
    """Entry-point for script.

    Returns
    -------
    :class:`int`
        An integer suitable for passing to :func:`sys.exit`.
    """
    from sys import argv
    from csv import reader
    from datetime import date
    from os import getenv
    from os.path import exists
    import json
    import calendar
    import numpy as np
    try:
        import matplotlib
        matplotlib.use('Agg')
        matplotlib.rcParams['figure.figsize'] = (16.0, 12.0)
        import matplotlib.pyplot as plt
        from matplotlib.font_manager import fontManager, FontProperties
        import matplotlib.dates as mdates
        legendfont= FontProperties(size='medium');
        titlefont = FontProperties(size='large')
        years = mdates.YearLocator()
        has_matplotlib = True
    except ImportError:
        has_matplotlib = False
    #
    #
    #
    numbers = list()
    dates = list()
    json_dict = list()
    try:
        hashes_file = argv[1]
    except IndexError:
        print("CSV file must be specified!")
        return 1
    if not exists(hashes_file):
        print("{0} does not exist!".format(hashes_file))
        return 1
    with open(hashes_file) as f:
        CSV = reader(f)
        for row in CSV:
            if row[0] == 'Number':
                continue
            if len(row) != 6:
                print(row)
            n = int(row[0])
            d = map(int,row[1].split('-'))
            d = date(*d)
            dates.append(d)
            numbers.append(n)
            json_dict.append({
                "number":n,
                "date":calendar.timegm(d.timetuple())*1000,
                "hare":row[2],
                "start":row[3],
                "notes":row[4],
                "kennel":row[5],
                })
    n0 = numbers[0]
    numbers = np.array(numbers)
    real_numbers = numbers[numbers > 0]
    nn = real_numbers.size
    assert np.abs(real_numbers - (np.arange(nn) + n0)).sum() == 0
    d0 = dates[0]
    ndates = list()
    for k in range(len(dates)):
        if numbers[k] > 0:
            ndates.append(dates[k])
        if k > 0:
            if dates[k] < dates[k-1]:
                print(dates[k], dates[k-1])
    #
    # Integrity check.
    #
    assert nn == len(ndates)
    #
    # Plot
    #
    if has_matplotlib:
        fig = plt.figure(dpi=100)
        ax = fig.add_subplot(111)
        p0 = ax.plot_date(ndates,real_numbers,'k-')
        foo = ax.xaxis.set_major_locator(years)
        foo = ax.set_xlim(date(2002,1,1),date(date.today().year+1,1,1))
        end = ((real_numbers[-1]//100)+1)*100
        foo = ax.set_ylim(0,end)
        foo = ax.yaxis.set_ticks(np.arange(0, end+100, 100))
        foo = ax.grid(True)
        foo = ax.set_xlabel('Date')
        foo = ax.set_ylabel('Number')
        fig.savefig('hashes.png')
        plt.close(fig)
    #
    # Write JSON data.
    #
    # print(actual_n[-1])
    with open('hashes.json', 'w') as j:
        json.dump(json_dict, j, separators=(',', ':'))
    return 0


if __name__ == '__main__':
    from sys import exit
    exit(main())
