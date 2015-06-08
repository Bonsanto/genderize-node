package bonsanto.org

import java.io.File
import java.util.Date
import java.util.logging.Level
import com.github.tototoshi.csv.CSVReader
import com.github.tototoshi.csv.CSVWriter
import com.github.tototoshi.csv.DefaultCSVFormat

object IDWriter {
  def main(args: Array[String]): Unit = {
    val csvInPath: String = "../data/in/nacional.csv"
    val csvOutPath: String = "../data/out/step1-ci.csv"

    getAllCis(csvInPath, csvOutPath)
  }

  val getAllCis = (in: String, out: String) => {
    implicit object RandomFormat extends DefaultCSVFormat {
      override val delimiter = ';'
    }

    val inFile: File = new File(in)
    val outFile: File = new File(out)
    val reader: CSVReader = CSVReader.open(inFile)
    val writer: CSVWriter = CSVWriter.open(outFile)

    println(Level.INFO, "STARTED ON", new Date())

    reader.foreach(row =>
      if (row.length > 1)
        writer.writeRow(List(row(1)))
    )

    println(Level.INFO, "FINISHED ON", new Date())
    reader.close()
    writer.close()
  }
}
